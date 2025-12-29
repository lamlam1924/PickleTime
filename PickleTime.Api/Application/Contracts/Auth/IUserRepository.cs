using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Auth;

public interface IUserRepository
{
    // ==================== LẤY USER ĐANG HOẠT ĐỘNG (Active + !IsDeleted) ====================
    Task<User?> GetByIdWithRolesAsync(int userId);
    Task<User?> GetByEmailWithRolesAsync(string email);
    Task<User?> GetByGoogleIdWithRolesAsync(string googleId);

    // ==================== LẤY USER CHỈ CẦN KIỂM TRA TỒN TẠI (không cần Roles) ====================
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByGoogleIdAsync(string googleId);
    Task<User?> GetByResetTokenAsync(string token);

    // ==================== DANH SÁCH USER THEO TRẠNG THÁI ====================
    Task<List<User>> GetAllUsersWithRolesAsync();        // Tất cả chưa xóa (Active + Inactive)
    Task<List<User>> GetActiveUsersAsync();              // StatusId = 1 + !IsDeleted
    Task<List<User>> GetInactiveUsersAsync();           // StatusId = 2 + !IsDeleted
    Task<List<User>> GetDeletedUsersAsync();             // IsDeleted = true
    Task<User?> GetDeletedUserByIdAsync(int userId);     // Dùng để khôi phục

    // ==================== LẤY THEO ROLE (chỉ Active user) ====================
    Task<List<User>> GetOwnersWithRolesAsync();          // RoleId = 2 + Active
    Task<List<int>> GetUserIdsByRoleAsync(int roleId);   // Lấy nhanh list ID để gửi notif

    // ==================== THAO TÁC VỚI ROLE ====================
    Task AddRoleToUserAsync(int userId, int roleId);

    // ==================== CRUD CƠ BẢN ====================
    Task CreateAsync(User user);
    Task UpdateAsync(User user);

    // ==================== THỐNG KÊ NHANH ====================
    Task<int> CountActiveUsersAsync();
    Task<int> CountInactiveUsersAsync();
    Task<int> CountDeletedUsersAsync();
}