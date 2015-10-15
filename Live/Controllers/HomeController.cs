using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Live.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
            var terms = Request.RawUrl.Split(new char[] { '/' },StringSplitOptions.RemoveEmptyEntries);
            if (terms.Length > 0 && terms[0].Equals("tags", StringComparison.CurrentCultureIgnoreCase))
            {
                var termsString = "";
                foreach(var t in terms.Skip(1))
                {
                    termsString += (t.StartsWith("@") ? "" : "#") + t + " ";
                }
                ViewBag.QueryTerms = termsString;
            }
            return View();
        }

        [Authorize]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Detail(long chanceId)
        {
            //return Redirect("/#/Chance/" + chanceId);
            ViewBag.Title = "Detail Page";
            ViewBag.ChanceId = chanceId;
            ViewBag.QueryTerms = chanceId.ToString();
            return View();
        }
    }
}
