using System;
using System.Linq;
using Qantor.DataAccess.Enums;
using Qantor.DataAccess.Models;

namespace Qantor.DataAccess.Migrations
{
    public class DbInitializer
    {
        private readonly Random _random = new Random();
        private readonly ApplicationDbContext _context;

        public DbInitializer(ApplicationDbContext context)
        {
            _context = context;
        }

        public void Initialize()
        {
            if (_context.Users.Any())
            {
                return;
            }

            GenerateUser("jkowalski@qantor.pl", "Jan", "Kowalski", DateTime.Now.AddYears(-30), "admin1", 100);
            GenerateUser("knowak@qantor.pl", "Krzysztof", "Nowak", DateTime.Now.AddYears(-35), "admin2", 70);

            _context.Add(CreateExchangeRate(Currency.CHF, NextPastDate(), 3.8549m, 3.8677m, 1));
            _context.Add(CreateExchangeRate(Currency.CZK, NextPastDate(), 14.4452m, 14.4758m, 100));
            _context.Add(CreateExchangeRate(Currency.EUR, NextPastDate(), 4.0405m, 4.0457m, 1));
            _context.Add(CreateExchangeRate(Currency.GBP, NextPastDate(), 5.3669m, 5.3845m, 1));
            _context.Add(CreateExchangeRate(Currency.RUB, NextPastDate(), 7.5791m, 7.5958m, 100));
            _context.Add(CreateExchangeRate(Currency.USD, NextPastDate(), 3.7301m, 3.7402m, 1));
            _context.Add(CreateExchangeRate(Currency.AED, NextPastDate(), 1m, 1m, 1));

            _context.SaveChanges();

            _context.Add(CreateExchangeRate(Currency.CHF, NextPastDate(), 3.8649m, 3.8777m, 1));
            _context.Add(CreateExchangeRate(Currency.CZK, NextPastDate(), 14.3452m, 14.3758m, 100));
            _context.Add(CreateExchangeRate(Currency.EUR, NextPastDate(), 4.0408m, 4.0460m, 1));
            _context.Add(CreateExchangeRate(Currency.GBP, NextPastDate(), 5.3649m, 5.3825m, 1));
            _context.Add(CreateExchangeRate(Currency.RUB, NextPastDate(), 7.4791m, 7.4958m, 100));
            _context.Add(CreateExchangeRate(Currency.USD, NextPastDate(), 3.2301m, 3.2402m, 1));
            _context.Add(CreateExchangeRate(Currency.AED, NextPastDate(), 1m, 1m, 1));


            _context.SaveChanges();

            _context.Add(CreateLoyaltyPoint(0m, 99.99m, 0));
            _context.Add(CreateLoyaltyPoint(101m, 500m, 1));
            _context.Add(CreateLoyaltyPoint(500m, 1000m, 3));
            _context.Add(CreateLoyaltyPoint(1000.01m, 9999999999999999.99m, 5));

            _context.SaveChanges();
        }
        private void GenerateUser(
            string email,
            string firstName,
            string lastName,
            DateTime dateOfBirth,
            string password,
            int transactionCount)
        {
            var user = CreateUser(email, firstName, lastName, password, dateOfBirth);
            foreach (Currency currency in Enum.GetValues(typeof(Currency)))
            {
                _context.Add(CreateUserAccount(NextAmount(10000), currency, user));
            }

            for (int i = 0; i < transactionCount; ++i)
            {
                _context.Add(CreateUserTransaction(NextAmount(1000), NextEnum<Currency>(), NextPastDate(), NextEnum<TransactionType>(), user, 0));
            }
        }

        private decimal NextAmount(double max)
        {
            return new decimal(_random.NextDouble() * max);
        }

        private TEnum NextEnum<TEnum>()
        {
            var values = Enum.GetValues(typeof(TEnum));
            return (TEnum)values.GetValue(_random.Next(values.Length));
        }

        private DateTime NextPastDate()
        {
            return DateTime.Now - NextInterval();
        }

        private TimeSpan NextInterval()
        {
            return new TimeSpan(
                _random.Next(30),
                _random.Next(24),
                _random.Next(60),
                _random.Next(60),
                _random.Next(1000));
        }

        private static User CreateUser(string email, string firstName, string lastName, string password, DateTime dateOfBirth)
        {
            return new User
            {
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth,
                Password = password
            };
        }

        private static UserAccount CreateUserAccount(decimal balance, Currency currency, User user)
        {
            return new UserAccount
            {
                Balance = balance,
                Currency = currency,
                User = user
            };
        }

        private static UserTransaction CreateUserTransaction(decimal amount, Currency currency, DateTime date, TransactionType transactionType, User user, int points)
        {
            return new UserTransaction
            {
                Amount = amount,
                Currency = currency,
                Date = date,
                TransactionType = transactionType,
                User = user,
                Points = points,
                ArePointsActive = true
            };
        }

        private static ExchangeRate CreateExchangeRate(Currency currency, DateTime date, decimal purchasePrice, decimal sellPrice, int unit)
        {
            return new ExchangeRate
            {
                Currency = currency,
                Date = date,
                PurchasePrice = purchasePrice,
                SellPrice = sellPrice,
                Unit = unit
            };
        }

        private static LoyaltyPoint CreateLoyaltyPoint(decimal lowerRange, decimal upperRange, int points)
        {
            return new LoyaltyPoint
            {
                LowerRange = lowerRange,
                UpperRange = upperRange,
                Points = points
            };
        }
    }
}
