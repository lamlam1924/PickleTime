using PickleTime.Api.Application.Contracts.Auth.Dtos;

namespace PickleTime.Api.Application.Contract.Auth.Dto;

public class LoginResponseDto
{
    public string Token { get; set; } = null!;

    public string Message { get; set; } = null!;

    // public string Role { get; set; } = null!;
    public int UserId { get; set; }
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? FullName { get; set; }
    public List<RoleDto> Roles { get; set; } = new();
    public bool HasMultipleRoles => Roles.Count > 1;
}
