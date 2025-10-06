using PickleTime.Api.Application.Contracts.Facilities.Dtos;

namespace PickleTime.Api.Application.Contracts.Facilities;

public interface IFacilityService
{
    Task<IEnumerable<FacilityDto>> SearchFacilitiesAsync(string keyword);
    Task<IEnumerable<FacilityDto>> GetAllAsync();
    Task<FacilityDto?> GetByIdAsync(int id);
}