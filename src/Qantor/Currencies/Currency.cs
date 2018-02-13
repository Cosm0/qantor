using System.Runtime.Serialization;

namespace Qantor.Currencies
{
    [DataContract]
    public class Currency
    {
        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "code")]
        public string Code { get; set; }

        [DataMember(Name = "unit")]
        public int Unit { get; set; }

        [DataMember(Name = "purchasePrice")]
        public decimal PurchasePrice { get; set; }

        [DataMember(Name = "sellPrice")]
        public decimal SellPrice { get; set; }

        [DataMember(Name = "averagePrice")]
        public decimal AveragePrice { get; set; }
    }
}
