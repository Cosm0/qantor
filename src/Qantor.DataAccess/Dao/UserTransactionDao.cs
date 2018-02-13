using System;
using System.Collections.Generic;
using System.Linq;
using Qantor.DataAccess.Enums;
using Qantor.DataAccess.Models;

namespace Qantor.DataAccess.Dao
{
    public class UserTransactionDao : IUserTransactionDao
    {
        private readonly ApplicationDbContext _dbContext;

        public UserTransactionDao(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Add(int userId, decimal amount, Currency currency, TransactionType transactionType, int points)
        {
            var user = _dbContext.Users.FirstOrDefault(x => x.Id == userId);
            if (user != null)
            {
                _dbContext.UserTransactions.Add(new UserTransaction
                {
                    Amount = amount,
                    Currency = currency,
                    Date = DateTime.Now,
                    TransactionType = transactionType,
                    User = user,
                    Points = points,
                    ArePointsActive = true
                });
                _dbContext.SaveChanges();
            }
        }

        public IList<LoyaltyPoint> GetLoyaltyScale()
        {
            return _dbContext.LoyaltyPoints.ToList();
        }

        public bool HasBirthdayBonus(int userId)
        {
            var user = _dbContext.Users.FirstOrDefault(x => x.Id == userId);
            if (user != null)
            {
                var currentDay = DateTime.Now.Date;
                var birthday = user.DateOfBirth.Date;
                return currentDay.Day == birthday.Day && currentDay.Month == birthday.Month;
            }

            return false;
        }

        public bool HasLoyaltyBonus(int userId)
        {
            var user = _dbContext.Users.FirstOrDefault(x => x.Id == userId);
            if (user != null)
            {
                var hasLoyaltyBonus = _dbContext.UserTransactions.Where(t => t.ArePointsActive).Select(t => t.Points).Sum() >= 10;
                if (hasLoyaltyBonus)
                {
                    foreach (var transaction in _dbContext.UserTransactions.Where(t => t.ArePointsActive))
                    {
                        transaction.ArePointsActive = false;
                    }

                    return true;
                }
            }

            return false;
        }

        public bool HasPremiumBonus(int userId)
        {
            var user = _dbContext.Users.FirstOrDefault(x => x.Id == userId);
            if (user != null)
            {
                return _dbContext.UserTransactions.Select(t => t.Points).Sum() >= 100;
            }

            return false;
        }
    }
}
