namespace PickleTime.Api.Application.Contracts.Reviews.Dtos;

public class FacilityReviewsDto
{
    public IEnumerable<ReviewDto> Reviews { get; set; } = new List<ReviewDto>();
    public double AverageRating { get; set; }
}