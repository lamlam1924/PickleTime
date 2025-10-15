using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.Reviews;
using PickleTime.Api.Domain.Entities;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Infrastructure.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly PickleTimeDbContext _context;

    public ReviewRepository(PickleTimeDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Review>> GetReviewsByFacilityIdAsync(int facilityId)
    {
        return await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.ReviewStatus)
            .Where(r => r.FacilityId == facilityId && !r.IsDeleted)
            .AsNoTracking()
            .ToListAsync();
    }
}