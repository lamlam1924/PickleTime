namespace PickleTime.Api.Application.Contracts.Profile.Dtos;

public class UserStatisticsDto
{
    public int TotalBookings { get; set; }
    public int CompletedBookings { get; set; }
    public int CancelledBookings { get; set; }
    public int PendingBookings { get; set; }
    public decimal TotalSpent { get; set; }
    public int TotalReviews { get; set; }
    public decimal? AverageRating { get; set; }
}
