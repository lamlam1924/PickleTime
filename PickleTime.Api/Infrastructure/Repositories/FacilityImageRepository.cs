using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.Images;
using PickleTime.Api.Domain.Entities;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Infrastructure.Repositories;

public class FacilityImageRepository : IFacilityImageRepository
{
    private readonly PickleTimeDbContext _dbContext;

    public FacilityImageRepository(PickleTimeDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<FacilityImage>> GetByFacilityIdAsync(int facilityId)
    {
        return await _dbContext.FacilityImages
            .Where(x => x.FacilityId == facilityId && !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<FacilityImage?> GetByIdAsync(int imageId)
    {
        return await _dbContext.FacilityImages
            .FirstOrDefaultAsync(x => x.ImageId == imageId && !x.IsDeleted);
    }

    public async Task AddAsync(FacilityImage entity)
    {
        _dbContext.FacilityImages.Add(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(FacilityImage entity)
    {
        _dbContext.FacilityImages.Remove(entity);
        await _dbContext.SaveChangesAsync();
    }
}