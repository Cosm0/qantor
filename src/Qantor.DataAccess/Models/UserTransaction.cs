using System;
using Qantor.DataAccess.Enums;

namespace Qantor.DataAccess.Models
{
    public class UserTransaction
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public virtual Currency Currency { get; set; }
        public virtual TransactionType TransactionType { get; set; }
        public int Points { get; set; }
        public bool ArePointsActive { get; set; }

        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
