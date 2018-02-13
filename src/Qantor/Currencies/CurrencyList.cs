using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Qantor.Currencies
{
    [DataContract]
    public class CurrencyList
    {
        [DataMember(Name = "publicationDate")]
        public DateTime PublicationDate { get; set; }

        [DataMember(Name = "items")]
        public List<Currency> Items { get; set; }
    }
}
