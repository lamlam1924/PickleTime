using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.Owners;
using PickleTime.Api.Domain.Entities;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Infrastructure.Repositories;

public class OwnerRequestRepository : IOwnerRequestRepository
{
    private readonly PickleTimeDbContext _context;

    public OwnerRequestRepository(PickleTimeDbContext context)
    {
        _context = context;
    }

    public async Task<List<OwnerRequest>> GetAllAsync()
    {
        return await _context.OwnerRequests
            .Include(o => o.Status)
            .Include(o => o.ReviewedByNavigation)
            .Include(o => o.CreatedUser)
            .OrderByDescending(o => o.SubmittedAt)
            .ToListAsync();
    }

    public async Task<List<OwnerRequest>> GetByUserAsync(int userId)
    {
        return await _context.OwnerRequests
            .Include(o => o.Status)
            .Where(o => o.CreatedUserId == userId)
            .OrderByDescending(o => o.SubmittedAt)
            .ToListAsync();
    }

    public async Task<OwnerRequest?> GetByIdAsync(int id)
    {
        return await _context.OwnerRequests
            .Include(o => o.Status)
            .Include(o => o.ReviewedByNavigation)
            .FirstOrDefaultAsync(o => o.RequestId == id);
    }

    public async Task AddAsync(OwnerRequest request)
    {
        await _context.OwnerRequests.AddAsync(request);
    }

    public async Task UpdateAsync(OwnerRequest request)
    {
        _context.OwnerRequests.Update(request);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
