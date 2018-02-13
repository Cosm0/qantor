using System;
using System.ComponentModel.DataAnnotations;
using Qantor.DataAccess.Enums;

namespace Qantor.Dtos
{
    public class TransactionDataDto
    {
        [Required(ErrorMessage = "Amount is required.")]
        [Range(0.01, Double.PositiveInfinity)]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Currency is required.")]
        public Currency Currency { get; set; }

        [Required(ErrorMessage = "Transaction Type is required.")]
        public TransactionType TransactionType { get; set; }
    }
}
