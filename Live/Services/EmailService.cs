using Microsoft.AspNet.Identity;
using SendGrid;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Live.Services
{
    public class EmailService : IIdentityMessageService, IEmailService
    {
        public async Task SendAsync(string to, string subject, string messageText, string messageHtml = null, string from = null)
        {
            await SendAsyncInternal(to, subject, messageText, messageHtml, from);
        }
        private async Task SendAsyncInternal(string to, string subject, string messageText, string messageHtml = null, string from = null)
        {
            var myMessage = new SendGridMessage();
            myMessage.AddTo(to);
            myMessage.From = new System.Net.Mail.MailAddress(from ?? "noreply@savingchance.com", from ?? "SavingChance.com");
            myMessage.Subject = subject;
            myMessage.Text = messageText;
            myMessage.Html = messageHtml ?? "<html><body><pre>" + messageText.Replace("\r\n", "<br />") + "</pre></body></html>";

            var credentials = new NetworkCredential(
                       ConfigurationManager.AppSettings["mailAccount"],
                       ConfigurationManager.AppSettings["mailPassword"]
                       );

            // Create a Web transport for sending email.
            var transportWeb = new Web(credentials);

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

            // Send the email.
            if (transportWeb != null)
            {
                try
                {
                    await transportWeb.DeliverAsync(myMessage);
                }
                catch (Exception e)
                {
                    Trace.TraceError(e.ToString());
                    throw;
                }
            }
            else
            {
                Trace.TraceError("Failed to create Web transport.");
                await Task.FromResult(0);
            }
        }

        public async Task SendAsync(IdentityMessage message)
        {
            await ConfigSendGridasync(message);
        }


        // Use NuGet to install SendGrid (Basic C# client lib) 
        private async Task ConfigSendGridasync(IdentityMessage message)
        {
            var myMessage = new SendGridMessage();
            myMessage.AddTo(message.Destination);
            myMessage.From = new System.Net.Mail.MailAddress("noreply@savingchance.com", "SavingChance.com");
            myMessage.Subject = message.Subject;
            myMessage.Text = message.Body;
            myMessage.Html = message.Body;

            var credentials = new NetworkCredential(
                       ConfigurationManager.AppSettings["mailAccount"],
                       ConfigurationManager.AppSettings["mailPassword"]
                       );

            // Create a Web transport for sending email.
            var transportWeb = new Web(credentials);

            // Send the email.
            if (transportWeb != null)
            {
                try
                {
                    await transportWeb.DeliverAsync(myMessage);
                }
                catch(Exception e)
                {
                    Trace.TraceError(e.ToString());
                    throw;
                }
            }
            else
            {
                Trace.TraceError("Failed to create Web transport.");
                await Task.FromResult(0);
            }
        }
    }
}
