using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Live
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
               name: "Chance",
               url: "{chanceId}",
               defaults: new { controller = "Home", action = "Detail" },
               constraints: new { chanceId = @"\d+" });

            routes.MapRoute(
               name: "Account",
               url: "{handle}",
               defaults: new { controller = "Account", action = "ViewAccount" },
               constraints: new { handle = @"@\w+" });

            routes.MapRoute(
                name: "Tags",
                url: "tags/{*query}",
                defaults: new { controller = "Home", action = "Index", query = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

        }
    }
}
