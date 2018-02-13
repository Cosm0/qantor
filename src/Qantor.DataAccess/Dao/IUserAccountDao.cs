using Qantor.DataAccess.Enums;
using Qantor.DataAccess.Models;

namespace Qantor.DataAccess.Dao
{
    public interface IUserAccountDao
    {
        void Update(int userId, decimal amount, Currency currency);
        void CreateInitial(int userId);
    }
}
