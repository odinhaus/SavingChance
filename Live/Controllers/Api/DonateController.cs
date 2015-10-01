using Live.Models;
using Live.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;

namespace Live.Controllers.Api
{
    public class DonateController : ApiController
    {
        IPaymentService _paymentService;
        public DonateController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(DonationRequest request)
        {
            return Request.CreateResponse<DonationResponse>(await _paymentService.DonateAsync(request));
        }
    }
}
