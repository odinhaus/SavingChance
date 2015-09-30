using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.Models
{
    public enum ExpirationType
    {
        NonExpiring = 0,
        Expiring = 1
    }

    public enum SaveType
    {
        Adoption = 0,
        Donation = 1
    }

    public class Chance
    {
        public long Id { get; set; }
        public ExpirationType ExpirationType { get; set; }
        public SaveType SaveType { get; set; }
        public string Title { get; set; }
        public decimal Goal { get; set; }
        public decimal Total { get; set; }
        public DateTime Started { get; set; }
        public DateTime Expires { get; set; }
        public virtual ApplicationUser Sponsor { get; set; }
    }
}
