using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Live.Services
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string messageText, string messageHtml = null, string from = null);
    }
}
