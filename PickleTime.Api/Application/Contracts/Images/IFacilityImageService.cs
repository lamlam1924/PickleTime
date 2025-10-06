using PickleTime.Api.Application.Contracts.Images.Dtos;

namespace PickleTime.Api.Application.Contracts.Images;

public interface IFacilityImageService
{
    Task<IEnumerable<FacilityImageDto>> GetByFacilityIdAsync(int facilityId);
    Task<FacilityImageDto> UploadAsync(FacilityImageUploadRequest request);
    Task<bool> DeleteAsync(int imageId);
}