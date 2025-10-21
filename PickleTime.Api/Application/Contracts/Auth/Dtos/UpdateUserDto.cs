namespace PickleTime.Api.Application.Contracts.Auth.Dtos;

public class UpdateUserDto
{
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? MembershipType { get; set; }
    public int? RoleId { get; set; } // Admin can change role between Manager (2) and Customer (3)
}
