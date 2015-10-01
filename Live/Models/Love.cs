using ServiceStack.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.Models
{
    public class Love
    {
        [PrimaryKey]
        public long Id { get; set; }
        public virtual Chance Chance { get; set; }
        public virtual ApplicationUser User { get; set; }

    }
}
