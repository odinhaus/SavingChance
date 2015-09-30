using Live.Data;
using Live.Models;
using Microsoft.Owin;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity.Owin;
using System.Configuration;

namespace Live.Services
{
    public class PaymentService : IPaymentService
    {
        IUserService _userService;
        IOwinContext _owin;
        ApplicationDbContext _dbContext;
        public static readonly decimal STANDARD_FEE;
        static PaymentService()
        {
            STANDARD_FEE = decimal.Parse(ConfigurationManager.AppSettings["paymentFee"]);
        }

        public PaymentService(IUserService userService)
        {
            _userService = userService;
            _owin = HttpContext.Current.GetOwinContext();
            _dbContext = _owin.Get<ApplicationDbContext>();
        }

        public DonationResponse Donate(DonationRequest request)
        {
            try {
                var chance = _dbContext.Chances.FirstOrDefault(c => c.Id == request.ChanceId);

                if (chance == null)
                {
                    return new DonationResponse()
                    {
                        Amount = 0,
                        Confirmation = null,
                        Message = "This Chance has either expired, or has been deleted and can no longer accept donations.",
                        Status = DonationStatus.Error
                    };
                }

                if (chance.ExpirationType == ExpirationType.Expiring
                    && DateTime.Now > chance.Expires)
                {
                    return new DonationResponse()
                    {
                        Amount = 0,
                        Confirmation = null,
                        Message = "This Chance has expired, and can no longer accept donations.",
                        Status = DonationStatus.Error
                    };
                }
                else
                {
                    var charge = new StripeChargeCreateOptions()
                    {
                        Amount = (int)(request.Amount * 100M), // amount is in cents usd
                        Currency = "usd",
                        Description = "SavingChance.com " + request.DonationType.ToString(),
                        Source = new StripeSourceOptions()
                        {
                            TokenId = request.StripeToken
                        },
                        Capture = true
                    };

                    if (chance.SaveType == SaveType.Donation
                        || request.DonationType == DonationType.Donation)
                    {
                        // non-tipping point fee, goes straight to provider, we take a fee
                        charge.ApplicationFee = (int)(request.Amount * 100M * STANDARD_FEE); // fee is in cents usd
                        charge.Destination = chance.Sponsor.StripeAccountId;
                    }

                    var chargeService = new StripeChargeService();
                    var chargeReceipt = chargeService.Create(charge);

                    return new DonationResponse()
                    {
                        Amount = (decimal)chargeReceipt.Amount / 100M,
                        Confirmation = chargeReceipt.Id.Replace("ch_", ""),
                        Message = chargeReceipt.FailureMessage,
                        Status = chargeReceipt.Status == "succeeded" ? DonationStatus.Success : DonationStatus.Error
                    };
                }
            }
            catch(Exception ex)
            {
                return new DonationResponse()
                {
                    Amount = 0,
                    Confirmation = "n/a",
                    Message = ex.Message,
                    Status = DonationStatus.Error
                };
            }
        }
    }
}
