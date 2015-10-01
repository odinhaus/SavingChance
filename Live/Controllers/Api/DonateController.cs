using Live.Models;
using Live.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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
        public HttpResponseMessage Post(DonationRequest request)
        {
            var donateTask = _paymentService.DonateAsync(request);
            donateTask.Wait();
            return Request.CreateResponse<DonationResponse>(donateTask.Result);
        }
    }
}
