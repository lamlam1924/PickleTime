using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Auth;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByGoogleIdAsync(string googleId);
    Task<User?> GetByResetTokenAsync(string token);
    Task UpdateAsync(User user);
    Task CreateAsync(User user);
}