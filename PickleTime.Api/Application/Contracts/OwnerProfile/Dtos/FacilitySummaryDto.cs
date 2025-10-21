namespace PickleTime.Api.Application.Contracts.OwnerProfile.Dtos
{
    public class FacilitySummaryDto
    {
        public int FacilityId { get; set; }
        public string FacilityName { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string Status { get; set; } = null!;
        
        // Statistics for this facility
        public int TotalCourts { get; set; }
        public int ActiveCourts { get; set; }
        public int TotalBookings { get; set; }
        public int CompletedBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalReviews { get; set; }
        public double AverageRating { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
