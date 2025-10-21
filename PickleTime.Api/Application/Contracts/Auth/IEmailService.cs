namespace PickleTime.Api.Application.Contracts.Auth;

public interface IEmailService
{
    Task<bool> SendPasswordResetEmailAsync(string email, string resetToken, string userName);
}

