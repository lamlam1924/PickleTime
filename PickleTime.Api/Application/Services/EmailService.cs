using System.Net;
using System.Net.Mail;
using PickleTime.Api.Application.Contracts.Auth;

namespace PickleTime.Api.Application.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> SendPasswordResetEmailAsync(string email, string resetToken, string userName)
    {
        try
        {
            var smtpHost = _configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var smtpUsername = _configuration["Email:Username"]; // Fixed: was SmtpUsername
            var smtpPassword = _configuration["Email:Password"]; // Fixed: was SmtpPassword
            var fromEmail = _configuration["Email:FromEmail"] ?? smtpUsername;

            if (string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
            {
                _logger.LogWarning("Email configuration is missing. Using mock email sending.");
                return await SendMockEmailAsync(email, resetToken, userName);
            }

            using var client = new SmtpClient(smtpHost, smtpPort);
            client.EnableSsl = true;
            client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);

            var baseUrl = _configuration["Email:ResetPasswordUrl"] ?? "http://localhost:5173";
            var resetUrl = $"{baseUrl}/reset-password?token={resetToken}";
            
            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail, "PickleTime"),
                Subject = "Reset Your Password - PickleTime",
                Body = GeneratePasswordResetEmailBody(userName, resetUrl),
                IsBodyHtml = true
            };

            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation($"Password reset email sent to {email}");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to send password reset email to {email}");
            return false;
        }
    }

    private async Task<bool> SendMockEmailAsync(string email, string resetToken, string userName)
    {
        // For development/testing purposes - log the reset link instead of sending email
        var baseUrl = _configuration["Email:ResetPasswordUrl"] ?? "http://localhost:5173";
        var resetUrl = $"{baseUrl}/reset-password?token={resetToken}";
        _logger.LogInformation($"MOCK EMAIL - Password reset link for {email} ({userName}): {resetUrl}");
        await Task.Delay(100); // Simulate async operation
        return true;
    }

    private string GeneratePasswordResetEmailBody(string userName, string resetUrl)
    {
        return $@"
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }}
                .footer {{ background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }}
                .button {{ display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .button:hover {{ background-color: #0056b3; }}
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>PickleTime</h1>
                    <h2>Password Reset Request</h2>
                </div>
                <div class='content'>
                    <p>Hello {userName},</p>
                    <p>We received a request to reset your password for your PickleTime account.</p>
                    <p>Click the button below to reset your password:</p>
                    <p style='text-align: center;'>
                        <a href='{resetUrl}' class='button'>Reset Password</a>
                    </p>
                    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p style='word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px;'>
                        {resetUrl}
                    </p>
                    <p><strong>Important:</strong></p>
                    <ul>
                        <li>This link will expire in 24 hours</li>
                        <li>If you didn't request this password reset, please ignore this email</li>
                        <li>For security reasons, do not share this link with anyone</li>
                    </ul>
                </div>
                <div class='footer'>
                    <p>This email was sent from PickleTime. If you have any questions, please contact our support team.</p>
                    <p>&copy; 2025 PickleTime. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>";
    }
}
