using Live.Controllers;
using Live.Services;
using Microsoft.AspNet.Identity;
using StructureMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StructureMap.Graph;

namespace Live.DI
{
    public static class IoC
    {
        public static IContainer Register()
        {
            return new Container(c =>
            {
                c.Scan(scanner =>
                {
                    scanner.TheCallingAssembly();
                    scanner.WithDefaultConventions();
                });
                c.For<IIdentityMessageService>().Use<EmailService>();
                c.For<IPaymentService>().Use<PaymentService>();
                c.For<IUserService>().Use<UserService>();
            });
        }
    }
}
