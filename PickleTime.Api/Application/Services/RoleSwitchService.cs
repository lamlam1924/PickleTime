using PickleTime.Api.Application.Contracts.Auth;
using PickleTime.Api.Application.Contracts.Auth.Dtos;
using PickleTime.Api.Common.Exceptions;
using PickleTime.Api.Common.Helpers;

namespace PickleTime.Api.Application.Services;

public class RoleSwitchService : IRoleSwitchService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtService _jwtService;

    public RoleSwitchService(IUserRepository userRepository, JwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<SelectRoleResponse> SwitchRoleAsync(int userId, int roleId)
    {
        // Lấy user với roles
        var user = await _userRepository.GetByIdWithRolesAsync(userId)
                   ?? throw new UnauthorizedAccessException("User not found");

        // Debug logging
        Console.WriteLine($"[RoleSwitchService] UserId={user.UserId}, RequestedRoleId={roleId}");
        Console.WriteLine($"[RoleSwitchService] User.Roles Count={user.Roles?.Count ?? 0}");
        if (user.Roles != null && user.Roles.Any())
        {
            Console.WriteLine($"[RoleSwitchService] Available Roles=[{string.Join(",", user.Roles.Select(r => r.RoleId))}]");
        }

        // Kiểm tra user có role đó không
        if (!RoleHelper.HasRole(user.Roles, roleId))
        {
            Console.WriteLine($"[RoleSwitchService] User does NOT have role {roleId}");
            throw new ForbidException($"Bạn không có quyền này. Role yêu cầu: {roleId}");
        }

        // Tạo token mới với role được chọn
        var newToken = _jwtService.GenerateToken(user, selectedRoleId: roleId);
        var roleDisplayName = RoleHelper.GetDisplayName(roleId);

        Console.WriteLine($"[RoleSwitchService] Successfully switched to role {roleId}");

        return new SelectRoleResponse
        {
            Token = newToken,
            SelectedRoleId = roleId,
            SelectedRoleName = roleDisplayName,
            Message = $"Đã chuyển sang chế độ: {roleDisplayName}"
        };
    }
}