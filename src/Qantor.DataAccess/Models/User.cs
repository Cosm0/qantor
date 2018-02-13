using System;
using System.Collections.Generic;

namespace Qantor.DataAccess.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public IList<UserAccount> Accounts { get; set; }
        public IList<UserTransaction> Transactions { get; set; }
    }
}
