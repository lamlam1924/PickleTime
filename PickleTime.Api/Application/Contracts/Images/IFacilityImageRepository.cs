using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Images;

public interface IFacilityImageRepository
{
    Task<IEnumerable<FacilityImage>> GetByFacilityIdAsync(int facilityId);
    Task<FacilityImage?> GetByIdAsync(int imageId);
    Task AddAsync(FacilityImage entity);
    Task DeleteAsync(FacilityImage entity);
}