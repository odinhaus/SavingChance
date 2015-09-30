using Live.Models;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.Services
{
    public class PaymentService : IPaymentService
    {
        public DonationResponse Donate(DonationRequest request)
        {
            var charge = new StripeChargeCreateOptions()
            {
                Amount = (int)(request.Amount * 100M),
                Currency = "usd",
                Description = "SavingChance.com " + request.DonationType.ToString(),
                Source = new StripeSourceOptions()
                {
                    TokenId = request.StripeToken
                },
                ApplicationFee = (int)(request.Amount * 100M * 0.05M),
                Capture = true,
                Destination = GetDestinationAccount(request)
            };
            var chargeService = new StripeChargeService();
            var chargeReceipt = chargeService.Create(charge);


            return new DonationResponse()
            {
                Amount = (decimal)chargeReceipt.Amount / 100M,
                Confirmation = chargeReceipt.Id,
                Message = chargeReceipt.FailureMessage,
                Status = chargeReceipt.Status == "Success" ? DonationStatus.Success : DonationStatus.Error
            };
        }

        public string GetDestinationAccount(DonationRequest request)
        {
            // need to look this up for the given ChanceId
            return "rp_16e8IOE2I5HVjWOxp3R8Co5G";
        }
    }
}
