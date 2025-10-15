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

        public async Task<IEnumerable<Facility>> SearchAsync(string keyword)
        {
            return await _context.Facilities
                .Include(f => f.Status)
                .Include(f => f.Courts)
                .ThenInclude(c => c.CourtImage)
                .Where(f => !f.IsDeleted &&
                            (f.FacilityName.Contains(keyword) ||
                             f.Address.Contains(keyword) ||
                             f.Province.Contains(keyword) ||
                             f.District.Contains(keyword) ||
                             f.Ward.Contains(keyword)))
                .ToListAsync();
        }
        public async Task<IEnumerable<Facility>> GetAllAsync()
        {
            return await _context.Facilities
                .Include(f => f.Status)
                .Include(f => f.FacilityImages)
                .Include(f => f.Courts)
                .ThenInclude(c => c.CourtImage)
                .Where(f => !f.IsDeleted)
                .ToListAsync();
        }

        public async Task<Facility?> GetByIdAsync(int id)
        {
            return await _context.Facilities
                .Include(f => f.Status)
                .Include(f => f.Courts)
                .ThenInclude(c => c.CourtImage)
                .Include(f => f.FacilityImages)
                .FirstOrDefaultAsync(f => f.FacilityId == id && !f.IsDeleted);
        }
        public async Task<Facility?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Facilities
                .Include(f => f.Status)
                .Include(f => f.ManagerUser)
                .Include(f => f.FacilityOperatingHours)
                .Include(f => f.FacilityImages.Where(img => !img.IsDeleted))
                .Include(f => f.Courts.Where(c => !c.IsDeleted))
                .ThenInclude(c => c.CourtImage)
                .Include(f => f.Courts)
                .ThenInclude(c => c.Type)
                .Include(f => f.Courts)
                .ThenInclude(c => c.Surface)
                .Include(f => f.Courts)
                .ThenInclude(c => c.Status)
                .Include(f => f.Reviews.Where(r => !r.IsDeleted))
                .ThenInclude(r => r.User)
                .Include(f => f.Reviews)
                .ThenInclude(r => r.ReviewStatus)
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.FacilityId == id && !f.IsDeleted);
        }


}
