namespace Qantor.Dtos
{
    public class ExchangeRateDto
    {
        public string Currency { get; set; }
        public int Unit { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal SellPrice { get; set; }
    }
}
