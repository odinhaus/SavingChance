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
using System.Net;
using System.IO;
using Newtonsoft.Json;

namespace Live.Services
{
    public class PaymentService : IPaymentService
    {
        IEmailService _emailService;
        IUserService _userService;
        IOwinContext _owin;
        ApplicationDbContext _dbContext;
        public static readonly decimal STANDARD_FEE;
        static PaymentService()
        {
            STANDARD_FEE = decimal.Parse(ConfigurationManager.AppSettings["paymentFee"]);
        }

        public PaymentService(IUserService userService, IEmailService emailService)
        {
            _emailService = emailService;
            _userService = userService;
            _owin = HttpContext.Current.GetOwinContext();
            _dbContext = _owin.Get<ApplicationDbContext>();
        }

        public async Task<DonationResponse> DonateAsync(DonationRequest request)
        {
            var currentUser = HttpContext.Current.User;
            try
            {
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
                        Description = "SavingChance.com " + request.DonationType.ToString() + " for '" + chance.Title + "'",
                        Source = new StripeSourceOptions()
                        {
                            TokenId = request.StripeToken
                        },
                        Capture = true
                    };

                    if (currentUser.Identity.IsAuthenticated)
                    {
                        charge.ReceiptEmail = currentUser.Identity.Name;
                    }
                    else if (!string.IsNullOrEmpty(request.Email))
                    {
                        charge.ReceiptEmail = request.Email;
                    }

                    var options = new StripeRequestOptions()
                    {
                        ApiKey = ConfigurationManager.AppSettings["StripeApiKey"]
                    };

                    if (chance.SaveType == SaveType.Donation
                        || request.DonationType == DonationType.Donation)
                    {
                        // non-tipping point fee, goes straight to provider, we take a fee
                        charge.ApplicationFee = (int)(request.Amount * 100M * STANDARD_FEE); // fee is in cents usd
                                                                                                //charge.Destination = chance.Sponsor.StripeAccountId;
                        options.StripeConnectAccountId = chance.Sponsor.StripeAccountId;
                    }

                    var chargeService = new StripeChargeService();
                    var chargeReceipt = chargeService.Create(charge, options);

                    if (request.IsPersonalized)
                    {
                        var message = string.IsNullOrEmpty(request.Message)
                            ? request.DonationType == DonationType.Adoption ? "I'd like to adopt '" + chance.Title + "'" : "I hope my donation will help '" + chance.Title + "'"
                            : request.Message;
                        message += "\r\n\r\n";
                        message += request.DonationType.ToString() + ": " + request.Amount.ToString("C0") + "\r\n";
                        message += "Payment: " + chargeReceipt.Source.Brand + ", Last Four: " + chargeReceipt.Source.Last4 + "\r\n";
                        message += "Created: " + chargeReceipt.Created.ToString() + "\r\n";
                        message += "Charge Id: " + chargeReceipt.Id + "\r\n";
                        string from = null;
                        if (!request.IsAnonymous)
                        {
                            if (currentUser.Identity.IsAuthenticated)
                                from = currentUser.Identity.Name;
                            else
                                from = request.Email;
                        }
                        // i want this to run async
                        _emailService.SendAsync(chance.Sponsor.Email,
                                request.DonationType == DonationType.Adoption ? "Adoption Request For " + chance.Title : "Donation For " + chance.Title,
                                message,
                                null,
                                from);
                    }

                    return new DonationResponse()
                    {
                        Amount = (decimal)chargeReceipt.Amount / 100M,
                        Confirmation = chargeReceipt.Id.Replace("ch_", ""),
                        Message = chargeReceipt.FailureMessage,
                        Status = chargeReceipt.Status == "succeeded" ? DonationStatus.Success : DonationStatus.Error
                    };
                }
            }
            catch (Exception ex)
            {
                return new DonationResponse()
                {
                    Amount = 0,
                    Confirmation = "n/a",
                    Message = ex.Message + (!string.IsNullOrEmpty(((StripeException)ex).StripeError.DeclineCode) 
                        ? "<br />Reason: " + ((StripeException)ex).StripeError.DeclineCode 
                        : ""),
                    Status = DonationStatus.Error
                };
            }
        }
    }
}
