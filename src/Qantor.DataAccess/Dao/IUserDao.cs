using System.Collections.Generic;
using Qantor.DataAccess.Models;

namespace Qantor.DataAccess.Dao
{
    public interface IUserDao
    {
        IList<User> GetAll();
        User GetById(int userId);
        IList<UserAccount> GetAccounts(int userId);
        IList<UserTransaction> GetTransactions(int userId);
        User Authenticate(string email, string password);
        int Create(User user);
        void Update(int userId, User editedUser);
    }
}
