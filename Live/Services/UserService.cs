﻿using Live.Data;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity.Owin;
using Live.Managers;
using Live.Models;

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
        public async Task UpdateStripeAccountAsync(string stripeAccountId)
        {
            var userManager = _owin.Get<ApplicationUserManager>();
            var user = await userManager.FindByNameAsync(_owin.Authentication.User.Identity.Name);
            user.StripeAccountId = stripeAccountId;
            var update = await userManager.UpdateAsync(user);
        }

        public async Task RemoveStripeAccountAsync()
        {
            var userManager = _owin.Get<ApplicationUserManager>();
            var user = await userManager.FindByNameAsync(_owin.Authentication.User.Identity.Name);
            user.StripeAccountId = null;
            var updateResult = await userManager.UpdateAsync(user);
        }

        public async Task UpdateViewFilterAsync(ViewFilter filter)
        {
            var userManager = _owin.Get<ApplicationUserManager>();
            var user = _dbContext.Users.Single(u => u.Email == _owin.Authentication.User.Identity.Name);
            if (user.ViewFilter == null)
            {
                user.ViewFilter = _dbContext.ViewFilters.Create();
                _dbContext.ViewFilters.Add(user.ViewFilter);
            }

            user.ViewFilter.AnimalTypes = filter.AnimalTypes;

            await _dbContext.SaveChangesAsync();
        }

        public async Task<ApplicationUser> UpdateAccountAsync(ApplicationUser user)
        {
            var current = _dbContext.Users.Single(u => u.Email == _owin.Authentication.User.Identity.Name);
            current.Title = user.Title ?? current.Title;
            current.Mission = user.Mission ?? current.Mission;
            current.PageUri = user.PageUri ?? current.PageUri;
            current.HeroUri = user.HeroUri ?? current.HeroUri;
            current.ContactUs = user.ContactUs ?? current.ContactUs;
            await _dbContext.SaveChangesAsync();
            return current;
        }

        public async Task<ApplicationUser> UpdateHeroImageAsync(ApplicationUser user)
        {
            var current = _dbContext.Users.Single(u => u.Email == _owin.Authentication.User.Identity.Name);
            current.HeroUri = user.HeroUri;
            await _dbContext.SaveChangesAsync();
            return current;
        }

        public async Task<ApplicationUser> UpdateHeroAttributesAsync(ApplicationUser user)
        {
            var current = _dbContext.Users.Single(u => u.Email == _owin.Authentication.User.Identity.Name);
            current.Title = user.Title;
            current.Mission = user.Mission;
            current.ContactUs = user.ContactUs;
            await _dbContext.SaveChangesAsync();
            return current;
        }
    }
}
