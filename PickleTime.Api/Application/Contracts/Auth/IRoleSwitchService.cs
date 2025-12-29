using PickleTime.Api.Application.Contracts.Auth.Dtos;

namespace PickleTime.Api.Application.Contracts.Auth;

public interface IRoleSwitchService
{
    Task<SelectRoleResponse> SwitchRoleAsync(int userId, int roleId);
}