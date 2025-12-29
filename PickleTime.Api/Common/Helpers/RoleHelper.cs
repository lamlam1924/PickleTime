using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Common.Helpers;

public static class RoleHelper
{
    private const int AdminRoleId = 1;
    private const int OwnerRoleId = 2;
    private const int CustomerRoleId = 3;

    private static int GetPriority(int roleId) => roleId switch
    {
        AdminRoleId => 3,
        OwnerRoleId => 2,
        CustomerRoleId => 1,
        _ => 0
    };

    // 1. Lấy tên role tiếng Anh (trong DB)
    public static string GetPrimaryRoleName(ICollection<Role> roles)
    {
        if (roles == null || !roles.Any()) return "customer";

        return roles
            .OrderByDescending(r => GetPriority(r.RoleId))
            .First()
            .RoleName ?? "customer";
    }

    // 2. Lấy RoleId ưu tiên cao nhất
    public static int GetPrimaryRoleId(ICollection<Role> roles)
    {
        if (roles == null || !roles.Any()) return CustomerRoleId;

        return roles
            .OrderByDescending(r => GetPriority(r.RoleId))
            .First()
            .RoleId;
    }

    // 3. KIỂM TRA QUYỀN – DÙNG KHẮP NƠI
    public static bool HasRole(ICollection<Role> roles, int roleId)
        => roles?.Any(r => r.RoleId == roleId) == true;

    public static bool IsAdmin(ICollection<Role> roles) => HasRole(roles, AdminRoleId);
    public static bool IsOwner(ICollection<Role> roles) => HasRole(roles, OwnerRoleId);
    public static bool IsCustomer(ICollection<Role> roles) => HasRole(roles, CustomerRoleId);

    // 4. CHUYỂN ĐỔI SANG TIẾNG VIỆT ĐỂ HIỂN THỊ (UI) – QUAN TRỌNG NHẤT!
    public static string GetDisplayName(ICollection<Role> roles)
        => GetPrimaryRoleId(roles) switch
        {
            AdminRoleId => "Quản trị viên",
            OwnerRoleId => "Chủ sân",
            CustomerRoleId => "Khách hàng",
            _ => "Không xác định"
        };

    public static string GetDisplayName(int roleId) => roleId switch
    {
        AdminRoleId => "Quản trị viên",
        OwnerRoleId => "Chủ sân",
        CustomerRoleId => "Khách hàng",
        _ => "Không xác định"
    };

    public static string GetDisplayName(string roleNameEn) => roleNameEn?.ToLower() switch
    {
        "admin" => "Quản trị viên",
        "owner" => "Chủ sân",
        "customer" => "Khách hàng",
        _ => "Không xác định"
    };

    // 5. Extension method – Dùng siêu gọn trong Select()
    public static string ToDisplayName(this Role role)
        => GetDisplayName(role.RoleId);
}