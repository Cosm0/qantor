using Qantor.DataAccess.Enums;

namespace Qantor.DataAccess.Models
{
    public class UserAccount
    {
        public int Id { get; set; }
        public decimal Balance { get; set; }
        public virtual Currency Currency { get; set; }

        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
