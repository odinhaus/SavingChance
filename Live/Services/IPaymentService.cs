using Live.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.Services
{
    public interface IPaymentService
    {
        DonationResponse Donate(DonationRequest request);
    }
}
