using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Qantor.Currencies;
using Qantor.Dtos;

namespace Qantor.Controllers
{
    public class ExchangeRatesController : Controller
    {
        private readonly ICurrencyService _currencyService;
        private readonly IMapper _mapper;

        public ExchangeRatesController(ICurrencyService currencyService, IMapper mapper)
        {
            _currencyService = currencyService;
            _mapper = mapper;
        }

        [HttpGet]
        [ActionName("current")]
        public async Task<IActionResult> GetCurrent()
        {
            return Ok(_mapper.Map<IList<ExchangeRateDto>>((await _currencyService.LoadCurrenciesAsync()).Items));
        }
    }
}
