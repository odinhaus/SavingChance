using ServiceStack.DataAnnotations;
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

    public enum ChanceStatus
    {
        Open = 0,
        Disabled = 1,
        Expired = 2,
        PendingAdoption = 3,
        Adopted = 4,
        Closed = 5
    }

    [Flags]
    public enum AnimalTypes
    {
        None = 0,
        Equine = 1,
        Canine = 2,
        Feline = 4,
        All = Equine | Canine | Feline
    }

    public class Chance
    {
        public Chance()
        {
            Tags = new List<Tag>();
            Payments = new List<Payment>();
        }
        [PrimaryKey]
        public long Id { get; set; }
        public ExpirationType ExpirationType { get; set; }
        public SaveType SaveType { get; set; }
        public string Title { get; set; }
        public decimal Goal { get; set; }
        public decimal Total { get; set; }
        public DateTime Started { get; set; }
        public DateTime Expires { get; set; }
        public virtual ApplicationUser Sponsor { get; set; }
        public ChanceStatus Status { get; set; }
        public virtual List<Tag> Tags { get; set; }
        public virtual List<Payment> Payments { get; set; }
        public AnimalTypes AnimalType { get; set; }
    }
}
