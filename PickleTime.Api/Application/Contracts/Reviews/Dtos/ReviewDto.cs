namespace PickleTime.Api.Application.Contracts.Reviews.Dtos;

public class ReviewDto
{
    public int ReviewId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime ReviewDate { get; set; }
    public bool IsVerifiedBooking { get; set; }
}