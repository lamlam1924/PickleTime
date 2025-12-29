using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.Facilities;
using PickleTime.Api.Domain.Entities;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Infrastructure.Repositories;

public class FacilityRepository : IFacilityRepository
{
    private readonly PickleTimeDbContext _context;

    public FacilityRepository(PickleTimeDbContext db)
    {
        _context = db;
    }

    // Dùng chung: chỉ lấy sân chưa xóa + trạng thái
    private IQueryable<Facility> ActiveFacilities => _context.Facilities
        .Where(f => !f.IsDeleted)
        .Include(f => f.Status);

    public async Task<IEnumerable<Facility>> GetAllAsync()
    {
        return await ActiveFacilities
            .Include(f => f.FacilityImages.Where(img => !img.IsDeleted))
            .Select(f => new Facility
            {
                FacilityId = f.FacilityId,
                FacilityName = f.FacilityName,
                Address = f.Address,
                Province = f.Province,
                District = f.District,
                Ward = f.Ward,
                OpenTime = f.OpenTime,
                CloseTime = f.CloseTime,
                Rating = f.Rating,
                TotalRatings = f.TotalRatings,
                StatusId = f.StatusId,
                Status = f.Status,
                FacilityImages = f.FacilityImages
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<Facility>> SearchAsync(string keyword)
    {
        return await ActiveFacilities
            .Include(f => f.FacilityImages.Where(img => !img.IsDeleted))
            .Where(f => f.FacilityName.Contains(keyword) ||
                        f.Address.Contains(keyword) ||
                        f.Province.Contains(keyword) ||
                        f.District.Contains(keyword) ||
                        f.Ward.Contains(keyword))
            .Select(f => new Facility
            {
                FacilityId = f.FacilityId,
                FacilityName = f.FacilityName,
                Address = f.Address,
                Province = f.Province,
                District = f.District,
                Ward = f.Ward,
                OpenTime = f.OpenTime,
                CloseTime = f.CloseTime,
                Rating = f.Rating,
                Status = f.Status,
                FacilityImages = f.FacilityImages
            })
            .ToListAsync();
    }

    public async Task<Facility?> GetByIdAsync(int id)
    {
        return await ActiveFacilities
            .Include(f => f.ManagerUser)
            .FirstOrDefaultAsync(f => f.FacilityId == id);
    }

    public async Task<Facility?> GetByIdWithDetailsAsync(int id)
    {
        return await _context.Facilities
            .Include(f => f.Status)
            .Include(f => f.ManagerUser)
            .Include(f => f.FacilityImages.Where(i => !i.IsDeleted))
            .Include(f => f.FacilityAmenities)
                .ThenInclude(fa => fa.Amenity)
            .Include(f => f.Courts.Where(c => !c.IsDeleted))
                .ThenInclude(c => c.CourtImage)
            .Include(f => f.Courts.Where(c => !c.IsDeleted))
                .ThenInclude(c => c.Type)
            .Include(f => f.Courts.Where(c => !c.IsDeleted))
                .ThenInclude(c => c.Surface)
            .Include(f => f.Courts.Where(c => !c.IsDeleted))
                .ThenInclude(c => c.Status)
            .Include(f => f.Reviews.Where(r => !r.IsDeleted))
                .ThenInclude(r => r.User)
            .Include(f => f.Reviews.Where(r => !r.IsDeleted))
                .ThenInclude(r => r.ReviewStatus)
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.FacilityId == id && !f.IsDeleted);
    }

    public async Task<List<FacilityImage>> GetImagesByFacilityIdAsync(int facilityId)
        => await _context.FacilityImages
            .Where(i => i.FacilityId == facilityId && !i.IsDeleted)
            .ToListAsync();

    public async Task<List<Court>> GetCourtsByFacilityIdAsync(int facilityId)
        => await _context.Courts
            .Include(c => c.CourtImage)
            .Include(c => c.Type)
            .Include(c => c.Surface)
            .Include(c => c.Status)
            .Where(c => c.FacilityId == facilityId && !c.IsDeleted)
            .ToListAsync();

    public async Task<IEnumerable<Facility>> GetAllWithDetailsAsync()
    {
        return await ActiveFacilities
            .Include(f => f.Courts.Where(c => !c.IsDeleted))
                .ThenInclude(c => c.Type)
            .Include(f => f.Courts.Where(c => !c.IsDeleted))
                .ThenInclude(c => c.Surface)
            .AsNoTracking()
            .ToListAsync();
    }
}