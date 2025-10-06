using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Facilities;

public interface IFacilityRepository
{
    Task<IEnumerable<Facility>> SearchAsync(string keyword);
    Task<IEnumerable<Facility>> GetAllAsync();
    Task<Facility?> GetByIdAsync(int id);
}