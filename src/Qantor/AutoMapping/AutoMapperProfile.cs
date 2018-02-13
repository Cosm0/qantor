using AutoMapper;
using Qantor.Currencies;
using Qantor.DataAccess.Models;
using Qantor.Dtos;

namespace Qantor.AutoMapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            CreateMap<Currency, ExchangeRateDto>()
                .ForMember(dest => dest.Currency, x => x.MapFrom(src => src.Code));
            CreateMap<ExchangeRate, ExchangeRateDto>()
                .ForMember(x => x.Currency, x => x.MapFrom(dto => dto.Currency.ToString()));
            CreateMap<UserTransaction, UserTransactionDto>()
                .ForMember(x => x.Currency, x => x.MapFrom(dto => dto.Currency.ToString()))
                .ForMember(x => x.TransactionType, x => x.MapFrom(dto => dto.TransactionType.ToString()));
            CreateMap<UserAccount, UserAccountDto>()
                .ForMember(x => x.Currency, x => x.MapFrom(dto => dto.Currency.ToString()));
        }
    }
}
