using System;
using Qantor.DataAccess.Enums;

namespace Qantor.Dtos
{
    public class UserTransactionDto
    {
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string TransactionType { get; set; }
    }
}
