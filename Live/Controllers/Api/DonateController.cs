using Live.Models;
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
        [HttpPost]
        public HttpResponseMessage Post(DonationRequest request)
        {
            return Request.CreateResponse<DonationResponse>(new DonationResponse()
            {
                Confirmation = "123456",
                Message = "Success",
                Amount = request.Amount
            });
        }
    }
}
