namespace PickleTime.Api.Application.Contracts.Auth.Dtos;

public class UpdateUserDto
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? MembershipType { get; set; }
    public int? RoleId { get; set; } // Single role for backward compatibility
    public List<int>? RoleIds { get; set; } // Multiple roles support
    public int? StatusId { get; set; }
}
