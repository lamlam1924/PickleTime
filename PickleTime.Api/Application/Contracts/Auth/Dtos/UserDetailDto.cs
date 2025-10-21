namespace PickleTime.Api.Application.Contracts.Auth.Dtos;

public class UserDetailDto
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
    public int RoleId { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public string? MembershipType { get; set; }
    public DateTime? LastLogin { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
