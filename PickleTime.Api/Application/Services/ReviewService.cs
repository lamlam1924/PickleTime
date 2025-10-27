using PickleTime.Api.Application.Contracts.Reviews;
using PickleTime.Api.Application.Contracts.Reviews.Dtos;

namespace PickleTime.Api.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;

    public ReviewService(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<FacilityReviewsDto> GetReviewsByFacilityIdAsync(int facilityId)
    {
        var reviews = await _reviewRepository.GetReviewsByFacilityIdAsync(facilityId);
        if (reviews == null || !reviews.Any())
        {
            return new FacilityReviewsDto
            {
                Reviews = new List<ReviewDto>(),
                AverageRating = 0
            };
        }

        var reviewDtos = reviews.Select(r => new ReviewDto
        {
            ReviewId = r.ReviewId,
            UserId = r.UserId, 
            UserName = r.User.FullName,
            Rating = r.Rating,
            Comment = r.Comment,
            ReviewDate = r.ReviewDate
        }).ToList();

        var avg = reviews.Average(r => r.Rating);

        return new FacilityReviewsDto
        {
            Reviews = reviewDtos,
            AverageRating = Math.Round(avg, 1)
        };
    }
}