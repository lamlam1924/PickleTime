using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Auth;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task UpdateAsync(User user);
    Task<User> CreateAsync(User user);
}