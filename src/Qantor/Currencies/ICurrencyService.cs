using System.Threading.Tasks;

namespace Qantor.Currencies
{
    public interface ICurrencyService
    {
        Task<CurrencyList> LoadCurrenciesAsync();
    }
}
