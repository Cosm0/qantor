using System.Collections.Generic;
using Qantor.DataAccess.Enums;
using Qantor.DataAccess.Models;

namespace Qantor.DataAccess.Dao
{
    public interface IUserTransactionDao
    {
        void Add(int userId, decimal amount, Currency currency, TransactionType transactionType, int points);

        IList<LoyaltyPoint> GetLoyaltyScale();

        bool HasBirthdayBonus(int userId);

        bool HasLoyaltyBonus(int userId);

        bool HasPremiumBonus(int userId);
    }
}
