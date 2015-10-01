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

    public enum DonationStatus
    {
        Success,
        Error
    }

    public class DonationRequest
    {
        public string StripeToken { get; set; }
        public long ChanceId { get; set; }
        public decimal Amount { get; set; }
        public DonationType DonationType { get; set; }
        public string Personalize { get; set; }
        public string Message { get; set; }
        public string Anonymous { get; set; }
        public bool IsAnonymous { get { return "on".Equals(Anonymous, StringComparison.InvariantCultureIgnoreCase); } }
        public bool IsPersonalized { get { return "on".Equals(Personalize, StringComparison.InvariantCultureIgnoreCase); } }
        public string Email { get; set; }
    }

    public class DonationResponse
    {
        public DonationStatus Status { get; set; }
        public string Message { get; set; }
        public string Confirmation { get; set; }
        public decimal Amount { get; set; }
    }
}
