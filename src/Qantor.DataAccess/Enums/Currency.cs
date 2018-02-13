using System.ComponentModel;

namespace Qantor.DataAccess.Enums
{
    public enum Currency
    {
        [Description("Polish Zloty")]
        PLN,
        [Description("US Dollar")]
        USD,
        [Description("Euro")]
        EUR,
        [Description("Swiss Franc")]
        CHF,
        [Description("Russian Ruble")]
        RUB,
        [Description("Czech Koruna")]
        CZK,
        [Description("Pound Sterling")]
        GBP,
        [Description("Emirati Dirham")]
        AED
    }
}
