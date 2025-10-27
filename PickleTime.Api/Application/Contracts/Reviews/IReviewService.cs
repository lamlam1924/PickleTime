using PickleTime.Api.Application.Contracts.Reviews.Dtos;

namespace PickleTime.Api.Application.Contracts.Reviews;

public interface IReviewService
{
    Task<FacilityReviewsDto> GetReviewsByFacilityIdAsync(int facilityId);
}