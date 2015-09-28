using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.Models
{
    public enum DonationType
    {
        Adoption = 0,
        Donation = 1,
        RefundableDonation = 2
    }

    public class DonationRequest
    {
        public string StripeToken { get; set; }
        public int ChanceId { get; set; }
        public decimal Amount { get; set; }
        public DonationType DonationType { get; set; }
    }

    public class DonationResponse
    {
        public string Message { get; set; }
        public string Confirmation { get; set; }
    }
}
