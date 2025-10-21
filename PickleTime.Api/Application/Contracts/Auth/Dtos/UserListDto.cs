namespace PickleTime.Api.Application.Contracts.Auth.Dtos;

public class UserListDto
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? FullName { get; set; }
    public int RoleId { get; set; } // Add RoleId for frontend
    public string RoleName { get; set; } = string.Empty;
    public string StatusName { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public string? MembershipType { get; set; }
    public DateTime? LastLogin { get; set; }
    public DateTime CreatedAt { get; set; }
}
