namespace PickleTime.Api.Application.Contracts.OwnerProfile.Dtos
{
    public class OwnerProfileDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public string Role { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string? Avatar { get; set; }
        public string? GoogleId { get; set; }
        public bool IsGoogleLogin => !string.IsNullOrEmpty(GoogleId);
        
        // Owner-specific fields
        public int TotalFacilities { get; set; }
        public int ActiveFacilities { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }
}
