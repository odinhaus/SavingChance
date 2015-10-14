using Live.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.Services
{
    public interface IUserService
    {
        Task UpdateStripeAccountAsync(string stripeAccountId);
        Task RemoveStripeAccountAsync();
        Task UpdateViewFilterAsync(ViewFilter filter);
        Task<ApplicationUser> UpdateAccountAsync(ApplicationUser user);
        Task<ApplicationUser> UpdateHeroImageAsync(ApplicationUser user);
        Task<ApplicationUser> UpdateHeroAttributesAsync(ApplicationUser user);
        Task<ApplicationUser> FollowAsync(string atHandle, bool follow);
        Task<int> GetFollowerCountAsync(string handle);
        Task<int> GetFollowingCountAsync(string handle);
    }
}
