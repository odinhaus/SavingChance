using Live.Data;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity.Owin;
using Live.Managers;

namespace Live.Services
{
    public class UserService : IUserService
    {
        IOwinContext _owin;
        ApplicationDbContext _dbContext;
        public UserService()
        {
            _owin = HttpContext.Current.GetOwinContext();
            _dbContext = _owin.Get<ApplicationDbContext>();
        }
        public void UpdateStripeAccount(string stripeAccountId)
        {
            var userManager = _owin.Get<ApplicationUserManager>();
            var userTask = userManager.FindByNameAsync(_owin.Authentication.User.Identity.Name);
            userTask.Wait();
            var user = userTask.Result;
            user.StripeAccountId = stripeAccountId;
            var updateResult = userManager.UpdateAsync(user);
            updateResult.Wait();
        }

        public void RemoveStripeAccount()
        {
            var userManager = _owin.Get<ApplicationUserManager>();
            var userTask = userManager.FindByNameAsync(_owin.Authentication.User.Identity.Name);
            userTask.Wait();
            var user = userTask.Result;
            user.StripeAccountId = null;
            var updateResult = userManager.UpdateAsync(user);
            updateResult.Wait();
        }
    }
}
