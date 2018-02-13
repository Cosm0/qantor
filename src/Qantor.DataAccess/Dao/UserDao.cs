using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Qantor.DataAccess.Models;

namespace Qantor.DataAccess.Dao
{
    public class UserDao : IUserDao
    {
        private readonly ApplicationDbContext _dbContext;

        public UserDao(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IList<User> GetAll()
        {
            return _dbContext.Users.ToList();
        }

        public User GetById(int userId)
        {
            return _dbContext.Users.Find(userId);
        }

        public IList<UserAccount> GetAccounts(int userId)
        {
            return (
                from user in _dbContext.Users
                where user.Id == userId
                select user.Accounts).Single();
        }

        public IList<UserTransaction> GetTransactions(int userId)
        {
            return (
                from user in _dbContext.Users
                where user.Id == userId
                select user.Transactions).Single();
        }

        public User Authenticate(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                return null;
            }

            return _dbContext.Users.FirstOrDefault(x => x.Email == email && x.Password == password);
        }

        public int Create(User user)
        {
#if BUG_1
            _dbContext.Database.ExecuteSqlCommand(
                "INSERT INTO dbo.Users(FirstName, LastName, Email, Password) VALUES ('" + user.FirstName + "','" + user.LastName + "','" + user.Email + "','" + user.Password + "');");
            return _dbContext.Users.OrderByDescending(x => x.Id).Select(y => y.Id).FirstOrDefault();
#else
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
            return user.Id;
#endif
        }

        public void Update(int userId, User editedUser)
        {
            var user = _dbContext.Users.FirstOrDefault(x => x.Id == userId);
            user.FirstName = editedUser.FirstName;
            user.LastName = editedUser.LastName;
            user.DateOfBirth = editedUser.DateOfBirth;
            user.Email = editedUser.Email;
            user.Password = editedUser.Password;

            _dbContext.SaveChanges();
        }
    }
}