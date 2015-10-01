using System.Linq;
using System.Threading.Tasks;
using Live.Data;
using Live.Models;
using Live.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using System.Collections.Generic;

namespace Live.Managers
{
    // Configure the application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.
    public class ApplicationUserManager : UserManager<ApplicationUser>
    {
        public ApplicationUserManager(IUserStore<ApplicationUser> store)
            : base(store)
        {
        }

        public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
        {
            var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context.Get<ApplicationDbContext>()));
            // Configure validation logic for usernames
            manager.UserValidator = new ApplicationUserValidator(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };
            // Configure validation logic for passwords
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true,
            };
            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(dataProtectionProvider.Create("ASP.NET Identity"));
            }

            manager.EmailService = new EmailService();

            return manager;
        }
    }

    public class ApplicationUserValidator : UserValidator<ApplicationUser>
    {
        private UserManager<ApplicationUser, string> UserManager;

        public ApplicationUserValidator(UserManager<ApplicationUser, string> manager) : base(manager)
        {
            this.UserManager = manager;
        }

        public override async Task<IdentityResult> ValidateAsync(ApplicationUser item)
        {
            var baseValidation = await base.ValidateAsync(item);
            var errors = new List<string>(baseValidation.Errors ?? new string[0]);
            if (errors.Count > 0 && errors[0].StartsWith("Name"))
            {
                errors.RemoveAt(0);
            }
            if (UserManager.Users.Any(u => u.AtHandle.Equals(item.AtHandle, System.StringComparison.InvariantCultureIgnoreCase)))
            {
                errors.Add(string.Format("Unique Handle {0} supplied is already taken.", item.AtHandle));
                baseValidation = new IdentityResult(errors);
            }
            return baseValidation;
        }
    } 
}
