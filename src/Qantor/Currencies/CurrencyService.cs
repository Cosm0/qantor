using System;
using System.Globalization;
using System.Net;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;

namespace Qantor.Currencies
{
    internal class CurrencyService : ICurrencyService
    {
        public Uri CurrenciesUri { get; set; }

        public async Task<CurrencyList> LoadCurrenciesAsync()
        {
            using ( var response = await WebRequest.Create(CurrenciesUri).GetResponseAsync())
            {
                using (var stream = response.GetResponseStream())
                {
                    var serializer = new DataContractJsonSerializer(
                        typeof(CurrencyList),
                        new DataContractJsonSerializerSettings
                        {
                            DateTimeFormat = new DateTimeFormat("yyyy-MM-ddTHH:mm:ss.FFFFFFF\\Z", CultureInfo.InvariantCulture)
                        });

                    var currencies = (CurrencyList)serializer.ReadObject(stream);
                    currencies.Items.Add(GetEmiratiDirhamCurrency());

                    return currencies;
                }
            }
        }

        private Currency GetEmiratiDirhamCurrency()
        {
            return new Currency()
            {
                AveragePrice = 1m,
                Code = "AED",
                Name = "Emirati Dirham",
                PurchasePrice = 1m,
                SellPrice = 1m,
                Unit = 1

            };
        }
    }
}
