using System.ComponentModel;

namespace Qantor.DataAccess.Enums
{
    public enum TransactionType
    {
        [Description("Money Deposit")]
        Deposit,
        [Description("Money Withdraw")]
        Withdraw,
        [Description("Currency Purchase")]
        Purchase,
        [Description("Currency Sell")]
        Sell
    }
}
