using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.Images;
using PickleTime.Api.Domain.Entities;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Infrastructure.Repositories;

public class CourtImageRepository : ICourtImageRepository
{
    private readonly PickleTimeDbContext _dbContext;

    public CourtImageRepository(PickleTimeDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<CourtImage>> GetByCourtIdAsync(int courtId)
    {
        return await _dbContext.CourtImages
            .Where(x => x.CourtId == courtId && !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<CourtImage?> GetByIdAsync(int imageId)
    {
        return await _dbContext.CourtImages.FirstOrDefaultAsync(x => x.ImageId == imageId);
    }

    public async Task AddAsync(CourtImage entity)
    {
        _dbContext.CourtImages.Add(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(CourtImage entity)
    {
        _dbContext.CourtImages.Remove(entity);
        await _dbContext.SaveChangesAsync();
    }
}