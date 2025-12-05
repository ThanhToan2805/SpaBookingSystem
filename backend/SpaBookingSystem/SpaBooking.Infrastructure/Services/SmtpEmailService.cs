using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using SpaBooking.Application.Interfaces.Services;

namespace SpaBooking.Infrastructure.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public SmtpEmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            var emailConfig = _config.GetSection("EmailSettings");

            // Lấy và kiểm tra config
            var fromEmail = emailConfig["FromEmail"] ?? throw new Exception("EmailSettings:FromEmail not configured");
            var fromName = emailConfig["FromName"] ?? "SpaBooking";
            var host = emailConfig["Host"] ?? throw new Exception("EmailSettings:Host not configured");
            var portStr = emailConfig["Port"] ?? throw new Exception("EmailSettings:Port not configured");
            var username = emailConfig["Username"] ?? throw new Exception("EmailSettings:Username not configured");
            var password = emailConfig["Password"] ?? throw new Exception("EmailSettings:Password not configured");

            if (!int.TryParse(portStr, out int port))
                throw new Exception("EmailSettings:Port is not a valid number");

            var message = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            message.To.Add(to);

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false
            };

            await client.SendMailAsync(message);
        }
    }
}