using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.Auth;
using PickleTime.Api.Domain.Entities;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Infrastructure.Repositories.Bookings;

public class UserRepository : IUserRepository
{
    private readonly PickleTimeDbContext _context;

    public UserRepository(PickleTimeDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.Role) // nếu cần role để đưa vào JWT claim
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<User> CreateAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }
}