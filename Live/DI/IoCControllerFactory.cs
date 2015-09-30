using StructureMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.Routing;

namespace Live.DI
{
    public class StructureMapControllerFactory : DefaultControllerFactory
    {
        public override IController CreateController(RequestContext requestContext, string controllerName)
        {
            return (IController)System.Web.Mvc.DependencyResolver.Current.GetServices(GetControllerType(requestContext, controllerName)).FirstOrDefault();
        }
    }
}
