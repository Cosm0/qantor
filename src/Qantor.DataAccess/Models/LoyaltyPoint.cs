namespace Qantor.DataAccess.Models
{
    public class LoyaltyPoint
    {
        public int Id { get; set; }
        public decimal LowerRange { get; set; }
        public decimal UpperRange { get; set; }
        public int Points { get; set; }
    }
}
