using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Reviews;

public interface IReviewRepository
{
    Task<IEnumerable<Review>> GetReviewsByFacilityIdAsync(int facilityId);
}