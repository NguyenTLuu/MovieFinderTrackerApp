using System.Net;
using System.Net.Mail;

namespace MovieApp_backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");

            var client = new SmtpClient(emailSettings["Host"], int.Parse(emailSettings["Port"]))
            {
                Credentials = new NetworkCredential(emailSettings["Mail"], emailSettings["Password"]),
                EnableSsl = true
            };

            var mailMessage = new MailMessage(emailSettings["Mail"], toEmail, subject, message);
            await client.SendMailAsync(mailMessage);
        }
    }
}