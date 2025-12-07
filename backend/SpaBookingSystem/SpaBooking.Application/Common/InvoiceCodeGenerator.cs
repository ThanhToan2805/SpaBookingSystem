using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpaBooking.Application.Common
{
    public static class InvoiceCodeGenerator
    {
        public static string Generate()
        {
            var date = DateTime.UtcNow.ToString("yyyyMMdd");
            var random = Guid.NewGuid().ToString("N").Substring(0, 5).ToUpper();
            return $"INV-{date}-{random}";
        }
    }
}
