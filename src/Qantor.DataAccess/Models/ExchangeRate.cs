using System;
using Qantor.DataAccess.Enums;

namespace Qantor.DataAccess.Models
{
    public class ExchangeRate
    {
        public int Id { get; set; }
        public Currency Currency { get; set; }
        public DateTime Date { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal SellPrice { get; set; }
        public int Unit { get; set; }
    }
}
