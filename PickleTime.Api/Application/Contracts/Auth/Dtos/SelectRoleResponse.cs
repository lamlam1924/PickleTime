namespace PickleTime.Api.Application.Contracts.Auth.Dtos;

public class SelectRoleResponse
{
    public string Token { get; set; } = null!;
    public int SelectedRoleId { get; set; }
    public string SelectedRoleName { get; set; } = null!;
    public string Message { get; set; } = null!;
}
public class SelectRoleRequest
{
    public int RoleId { get; set; } // 2 = Owner, 3 = Customer
}