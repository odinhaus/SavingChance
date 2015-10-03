using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.Models
{
    public class SearchModel
    {
        public long StartId { get; set; }
        public int PageSize { get; set; }
        public string Query { get; set; }
    }

    public class SearchResultsModel : SearchModel
    {
        public int Count { get; internal set; }
        public long LastId { get; set; }
        public IEnumerable<Chance> Results { get; set; }
    }
}
