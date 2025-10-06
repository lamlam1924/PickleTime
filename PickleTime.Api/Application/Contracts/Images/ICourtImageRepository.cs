using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Images;

public interface ICourtImageRepository
{
    Task<IEnumerable<CourtImage>> GetByCourtIdAsync(int courtId);
    Task<CourtImage?> GetByIdAsync(int imageId);
    Task AddAsync(CourtImage entity);
    Task DeleteAsync(CourtImage entity);
}