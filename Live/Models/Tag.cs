using ServiceStack.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.Models
{
    public class Tag
    {
        [PrimaryKey]
        public long Id { get; set; }
        public string Name { get; set; }
    }
}
