using Live.Services;
using Microsoft.AspNet.Identity;
using StructureMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.DI
{
    public static class IoC
    {
        public static IContainer Register()
        {
            return new Container(c =>
            {
                c.For<IIdentityMessageService>().Use<EmailService>();
            });
        }
    }
}
