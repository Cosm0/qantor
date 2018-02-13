using System;
using System.Linq;
using Qantor.DataAccess.Enums;
using Qantor.DataAccess.Models;

namespace Qantor.DataAccess.Dao
{
    public class UserAccountDao : IUserAccountDao
    {
        private readonly ApplicationDbContext _dbContext;

        public UserAccountDao(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Update(int userId, decimal amount, Currency currency)
        {
            var account = _dbContext.UserAccounts.FirstOrDefault(x => x.UserId == userId && x.Currency == currency);

            if (account != null)
            {
                account.Balance += amount;
                _dbContext.SaveChanges();
            }
        }

        public void CreateInitial(int userId)
        {
            foreach (Currency currency in Enum.GetValues(typeof(Currency)))
            {
                _dbContext.UserAccounts.Add(new UserAccount
                {
                    Currency = currency,
                    Balance = 0m,
                    UserId = userId
                });
            }

            _dbContext.SaveChanges();
        }
    }
}
