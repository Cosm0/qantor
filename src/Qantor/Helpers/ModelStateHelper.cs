using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Qantor.Helpers
{
    public static class ModelStateHelper
    {
        public static IEnumerable<string> Errors(this ModelStateDictionary modelState)
        {
            return !modelState.IsValid
                ? modelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage)
                : null;
        }
    }
}