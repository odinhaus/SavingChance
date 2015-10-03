using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Live.Models;
using Microsoft.Owin;
using Live.Data;
using System.Web;
using Microsoft.AspNet.Identity.Owin;

namespace Live.Services
{
    public class ChanceService : IChanceService
    {
        IOwinContext _owin;
        ApplicationDbContext _dbContext;
        public ChanceService()
        {
            _owin = HttpContext.Current.GetOwinContext();
            _dbContext = _owin.Get<ApplicationDbContext>();
        }

        public async Task<SearchResultsModel> SearchAsync(SearchModel model)
        {
            var results = new SearchResultsModel()
            {
                StartId = model.StartId,
                PageSize = model.PageSize,
                Query = model.Query
            };

            var chances = await Task.Run(() => 
            {
                var query = _dbContext.Chances
                            .Where(c => c.Id > model.StartId);

                if (!string.IsNullOrEmpty(model.Query))
                {
                    var splitQuery = model.Query.Split('=');
                    foreach(var queryArg in splitQuery[1].Split(' '))
                    {
                        if (queryArg.StartsWith("@"))
                        {

                        }
                    }
                }

                return query.Take(model.PageSize)
                            .ToArray();
            });

            results.Results = chances;
            results.LastId = chances.Last().Id;
            results.Count = chances.Length;

            return results;
        }
    }
}
