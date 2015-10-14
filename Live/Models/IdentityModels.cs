using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

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
        public ApplicationUser()
        {
            AtHandle = Guid.NewGuid().ToString();
        }

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
        [Index(IsUnique = true)]
        [Column(TypeName = "VARCHAR")]
        [StringLength(64)]
        public string AtHandle { get; set; }
        [NotMapped]
        public string BearerToken { get; set; }
        [JsonIgnore]
        public virtual List<Chance> Chances { get; set; }
        [JsonIgnore]
        public virtual List<Love> Loves { get; set; }
        public virtual ViewFilter ViewFilter { get; set; }
        public string Title { get; set; }
        public string Mission { get; set; }
        public string PageUri { get; set; }
        public string HeroUri { get; set; }
        public string ContactUs { get; set; }
        [JsonIgnore]
        public virtual List<ApplicationUser> Followers { get; set; }
        [JsonIgnore]
        public virtual List<ApplicationUser> Following { get; set; }
    }

    public class ViewFilter
    {
        public ViewFilter()
        {
            IsDefault = true;
        }

        [ServiceStack.DataAnnotations.PrimaryKey]
        public long Id { get; set; }
        [Index]
        public AnimalTypes AnimalTypes { get; set; }
        public bool IsDefault { get; set; }
        public bool OnlyFollowing { get; set; }
    }
}