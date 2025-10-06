using PickleTime.Api.Application.Contracts.Images.Dtos;

namespace PickleTime.Api.Application.Contracts.Images;

public interface ICourtImageService
{
        Task<IEnumerable<CourtImageDto>> GetByCourtIdAsync(int courtId);
        Task<CourtImageDto> UploadAsync(CourtImageUploadRequest request);
        Task<bool> DeleteAsync(int imageId);
}