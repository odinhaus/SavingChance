using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.Models
{
    public class DonationRequest
    {
        public string StripeToken { get; set; }
        public int ChanceId { get; set; }
    }

    public class DonationResponse
    {
        public string Message { get; set; }
        public string Confirmation { get; set; }
    }
}
