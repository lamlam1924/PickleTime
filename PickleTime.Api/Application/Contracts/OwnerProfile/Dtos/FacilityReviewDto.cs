namespace PickleTime.Api.Application.Contracts.OwnerProfile.Dtos
{
    public class FacilityReviewDto
    {
        public int ReviewId { get; set; }
        public int FacilityId { get; set; }
        public string FacilityName { get; set; } = null!;
        public string CustomerName { get; set; } = null!;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
