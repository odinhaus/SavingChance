﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.Services
{
    public interface IUserService
    {
        void UpdateStripeAccount(string stripeAccountId);
        void RemoveStripeAccount();
    }
}