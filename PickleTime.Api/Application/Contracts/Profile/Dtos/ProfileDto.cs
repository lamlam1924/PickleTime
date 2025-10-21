namespace PickleTime.Api.Application.Contracts.Profile.Dtos;

public class ProfileDto
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? FullName { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public string? Avatar { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public string? MembershipType { get; set; }
    public DateTime? LastLogin { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Login method
    public string? GoogleId { get; set; }
    public bool IsGoogleLogin => !string.IsNullOrEmpty(GoogleId);
}
