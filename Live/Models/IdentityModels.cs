using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.Owin.Security;
using System;

namespace Live.Models
{
    public enum UserType
    {
        Donor = 0,
        Provider
    }

    public enum ServiceProviderType
    {
        None = 0,
        Rescue,
        Veterinarian,
        Trainer,
        Behaviorist,
        OtherMedicalCare,
        OtherVendor
    }

    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            userIdentity.AddClaim(new Claim("UserType", this.UserType.ToString()));
            userIdentity.AddClaim(new Claim("ServiceProviderType", this.ServiceProviderType.ToString()));

            if (BearerToken == null)
            {
                BearerToken = CreateBearerToken();
            }

            userIdentity.AddClaim(new Claim("BearerToken", this.BearerToken));

            return userIdentity;
        }

        private string CreateBearerToken()
        {
            ClaimsIdentity identity = new ClaimsIdentity(Startup.OAuthOptions.AuthenticationType);

            identity.AddClaim(new Claim(ClaimTypes.Name, this.UserName));
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, this.Id));

            AuthenticationTicket ticket = new AuthenticationTicket(identity, new AuthenticationProperties());

            DateTime currentUtc = DateTime.UtcNow;
            ticket.Properties.IssuedUtc = currentUtc;
            ticket.Properties.ExpiresUtc = currentUtc.Add(TimeSpan.FromDays(14));

            return Startup.OAuthOptions.AccessTokenFormat.Protect(ticket);
        }

        public UserType UserType { get; set; }
        public ServiceProviderType ServiceProviderType { get; set; }
        public string StripeAccountId { get; set; }
        [NotMapped]
        public string BearerToken { get; set; }
    }
}