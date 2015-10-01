using ServiceStack.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.Models
{
    public class Payment
    {
        [PrimaryKey]
        public long Id { get; set; }
        public decimal Amount { get; set; }
        public DonationType PaymentType { get; set; }
        public DateTime Created { get; set; }
        public virtual ApplicationUser Payor { get; set; }
        public string StripeId { get; set; }
    }
}
