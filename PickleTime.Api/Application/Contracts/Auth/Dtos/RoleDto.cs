namespace PickleTime.Api.Application.Contracts.Auth.Dtos;

public class RoleDto
{
    public int RoleId { get; set; }
    public string RoleName { get; set; } = null!;
    public string DisplayName { get; set; } = null!; // ví dụ: "Chủ sân", "Khách hàng"
}
