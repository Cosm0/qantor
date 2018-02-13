using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Qantor.Currencies;
using Qantor.DataAccess.Dao;
using Qantor.DataAccess.Enums;
using Qantor.DataAccess.Models;
using Qantor.Dtos;
using Qantor.Helpers;
using Currency = Qantor.DataAccess.Enums.Currency;

namespace Qantor.Controllers
{
    public class UsersController : Controller
    {
        private const decimal BonusPercentage = 0.02m;
        private const bool IsBirthdayBonusActive = true;
        private const bool IsLoyaltyBonusActive = true;
        private const bool IsPremiumBonusActive = true;

        private readonly AppSettings _appSettings;
        private readonly IUserDao _userDao;
        private readonly IUserAccountDao _userAccountDao;
        private readonly IUserTransactionDao _userTransactionDao;
        private readonly ICurrencyService _currencyService;
        private readonly IMapper _mapper;

        public UsersController(IUserDao userDao, IUserAccountDao userAccountDao, IUserTransactionDao userTransactionDao,
            ICurrencyService currencyService, IMapper mapper, IOptions<AppSettings> appSettings)
        {
            _userDao = userDao;
            _userAccountDao = userAccountDao;
            _userTransactionDao = userTransactionDao;
            _currencyService = currencyService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Authenticate([FromBody] UserDto userDto)
        {
            var user = _userDao.Authenticate(userDto.Email, userDto.Password);

            if (user == null)
            {
                return Ok(new
                {
                    message = "Username or password is incorrect."
                });
                //BUG: security bug -> Replace text to: "Account with given e-mail not found in database"
            }

            var key = Encoding.ASCII.GetBytes(_appSettings.Key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Expires = DateTime.Now.AddHours(1),
                SigningCredentials =
                    new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Subject = new ClaimsIdentity(
                    new[]
                    {
                        new Claim(ClaimTypes.Name, user.Id.ToString())
                    })
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                user.Id,
                Token = tokenHandler.WriteToken(token)
            });
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register([FromBody] UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);

            if (ModelState.IsValid)
            {
                var newUserId = _userDao.Create(user);
                user.Id = newUserId;
                _userAccountDao.CreateInitial(user.Id);

                return Json(Ok());
            }

            return Json(new
            {
                errors = ModelState.Errors()
            });
        }

        public IActionResult GetAll()
        {
            var users = _userDao.GetAll();

            return Ok(_mapper.Map<IList<UserDto>>(users));
        }

        [HttpGet]
        [ActionName("user")]
        public IActionResult GetUserDetails(int id)
        {
            var user = _userDao.GetById(id);
            if (user == null)
            {
                return Ok(new
                {
                    message = "User not found"
                });
            }   

            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpGet]
        [ActionName("accounts")]
        public IActionResult GetAccounts(int id)
        {
            return Ok(_mapper.Map<IList<UserAccountDto>>(_userDao.GetAccounts(id).OrderBy(a => a.Currency.ToString())));
        }

        [ActionName("transactions")]
        public IActionResult GetTransactions(int id)
        {
            return Ok(_mapper.Map<IList<UserTransactionDto>>(_userDao.GetTransactions(id)));
        }

        [HttpPost]
        [ActionName("transactions")]
        public async Task<IActionResult> CreateTransaction(int id, [FromBody] TransactionDataDto transactionDataDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json(new
                    {
                        errors = ModelState.Errors()
                    });

                var userId = id;

                var amount = Math.Round(transactionDataDto.Amount, 2);
                var currency = transactionDataDto.Currency;
                var transactionType = transactionDataDto.TransactionType;

                var bonus = CalculateBonus(userId);
                var exchangeRates = await GetExchangeRates(currency);
                var points = CalculateLoyaltyPoints(amount, exchangeRates, transactionType);

                switch (transactionType)
                {
                    case TransactionType.Deposit:
                        _userTransactionDao.Add(userId, amount, currency, transactionType, points);
                        _userAccountDao.Update(userId, amount, currency);
                        break;
                    case TransactionType.Withdraw:
                        _userTransactionDao.Add(userId, amount, currency, transactionType, points);
                        _userAccountDao.Update(userId, -amount, currency);
                        break;
                    case TransactionType.Purchase:
                        _userTransactionDao.Add(userId, amount, currency, transactionType, points);
                        _userAccountDao.Update(userId, amount, currency);
                        _userAccountDao.Update(userId, Math.Round(-amount * exchangeRates.SellPrice * (1.00m - bonus) / exchangeRates.Unit, 2),
                            Currency.PLN);
                        break;
                    case TransactionType.Sell:
                        _userTransactionDao.Add(userId, amount, currency, transactionType, points);
                        _userAccountDao.Update(userId, -amount, currency);
                        _userAccountDao.Update(userId,
                            Math.Round(amount * exchangeRates.PurchasePrice * (1.00m + bonus) / exchangeRates.Unit, 2), Currency.PLN);
                        break;
                    default:
                        return Json(new
                        {
                            errors = "Invalid transaction type."
                        });
                }

                return Json(Ok());
            }
            catch (InvalidOperationException ex)
            {
                return Json(new
                {
                    errors = ex.Message
                });
            }
        }

        [HttpPost]
        [ActionName("user")]
        public IActionResult Edit(int id, [FromBody] UserDto userDto)
        {
            if (!ModelState.IsValid)
                return Json(new
                {
                    errors = ModelState.Errors()
                });

            var editedUser = Mapper.Map<User>(userDto);
            _userDao.Update(id, editedUser);

            return Json(Ok());
        }

        [HttpGet]
        [ActionName("bonus")]
        public IActionResult GetBonus(int id)
        {
            return Ok(CalculateBonus(id));
        }

        private int CalculateLoyaltyPoints(decimal amount, Currencies.Currency exchangeRates,
            TransactionType transactionType)
        {
            if (transactionType == TransactionType.Deposit || transactionType == TransactionType.Withdraw)
            {
                return 0;
            }

            decimal transactionScaleValue;
            switch (transactionType)
            {
                case TransactionType.Purchase:
                    transactionScaleValue = Math.Round(amount * exchangeRates.SellPrice / exchangeRates.Unit, 2);
                    break;
                case TransactionType.Sell:
                    transactionScaleValue = Math.Round(amount * exchangeRates.PurchasePrice / exchangeRates.Unit, 2);
                    break;
                case TransactionType.Deposit:
                case TransactionType.Withdraw:
                    return 0;
                default:
                    throw new InvalidEnumArgumentException();
            }
            
            return _userTransactionDao.GetLoyaltyScale()
                .Where(scale =>
                    scale.LowerRange <= transactionScaleValue && scale.UpperRange >= transactionScaleValue)
                .Select(x => x.Points).First();
        }

        private async Task<Currencies.Currency> GetExchangeRates(Currency currency)
        {
            return currency == Currency.PLN
                ? null
                : (await _currencyService.LoadCurrenciesAsync()).Items.First(x => x.Code == currency.ToString());
        }

        private decimal CalculateBonus(int userId)
        {
            var bonus = 0.00m;

            if (IsBirthdayBonusActive && _userTransactionDao.HasBirthdayBonus(userId))
            {
                bonus += BonusPercentage;
            }

            if (IsLoyaltyBonusActive && _userTransactionDao.HasLoyaltyBonus(userId))
            {
                bonus += BonusPercentage;
            }

            if (IsPremiumBonusActive && _userTransactionDao.HasPremiumBonus(userId))
            {
                bonus += BonusPercentage;
            }

            return bonus;
        }
    }
}