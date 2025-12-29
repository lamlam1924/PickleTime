using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.Auth;
using PickleTime.Api.Domain.Entities;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly PickleTimeDbContext _context;

    public UserRepository(PickleTimeDbContext context)
    {
        _context = context;
    }

    // ==================== 4 "NGĂN TỦ LẠNH" HOÀN HẢO ====================

    // 1. Tất cả user chưa bị xóa thật (dùng cho admin xem hết)
    private IQueryable<User> AllNotDeletedUsers => _context.Users
        .Where(u => !u.IsDeleted);

    // 2. User đang hoạt động bình thường (dùng cho login, hiển thị, gửi notif)
    private IQueryable<User> ActiveUsers => AllNotDeletedUsers
        .Include(u => u.Roles)
        .Where(u => u.StatusId == 1); // 1 = Active

    // 3. User bị khóa / không hoạt động (dùng cho admin xem danh sách bị khóa)
    private IQueryable<User> InactiveUsers => AllNotDeletedUsers
        .Include(u => u.Roles)
        .Where(u => u.StatusId == 2); // 2 = Inactive

    // 4. User đã bị soft delete (dùng cho khôi phục, audit log)
    private IQueryable<User> DeletedUsers => _context.Users
        .Include(u => u.Roles)
        .Where(u => u.IsDeleted);

    // ==================== CÁC HÀM DỰA TRÊN 4 TRẠNG THÁI NÀY ====================

    // DÙNG CHO LOGIN, PROFILE, JWT
    public async Task<User?> GetByIdWithRolesAsync(int userId)
        => await AllNotDeletedUsers
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == userId);

    public async Task<User?> GetByEmailWithRolesAsync(string email)
        => await AllNotDeletedUsers
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

    public async Task<User?> GetByGoogleIdWithRolesAsync(string googleId)
        => await _context.Users
            .Include(u => u.Roles)
            .Where(u => !u.IsDeleted && u.GoogleId == googleId)
            .FirstOrDefaultAsync();

    // DÙNG CHO ADMIN PANEL – XEM TẤT CẢ USER (kể cả Inactive)
    public async Task<List<User>> GetAllUsersWithRolesAsync()
        => await AllNotDeletedUsers
            .Include(u => u.Roles)
            .Include(u => u.Status)
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

    public async Task<List<User>> GetActiveUsersAsync()
        => await AllNotDeletedUsers.ToListAsync();

    public async Task<List<User>> GetInactiveUsersAsync()
        => await InactiveUsers.ToListAsync();

    public async Task<List<User>> GetDeletedUsersAsync()
        => await DeletedUsers.ToListAsync();

    // DÙNG CHO GỬI NOTIFICATION, DASHBOARD
    public async Task<List<int>> GetUserIdsByRoleAsync(int roleId)
        => await AllNotDeletedUsers
            .Where(u => u.Roles.Any(r => r.RoleId == roleId))
            .Select(u => u.UserId)
            .ToListAsync();

    public async Task<List<User>> GetOwnersWithRolesAsync()
        => await AllNotDeletedUsers
            .Where(u => u.Roles.Any(r => r.RoleId == 2))
            .ToListAsync();

    // DÙNG CHO KHÔI PHỤC TÀI KHOẢN
    public async Task<User?> GetDeletedUserByIdAsync(int userId)
        => await DeletedUsers.FirstOrDefaultAsync(u => u.UserId == userId);

    // ==================== CÁC HÀM NHẸ (KHÔNG CẦN ROLES) ====================

    public async Task<User?> GetByEmailAsync(string email)
        => await AllNotDeletedUsers.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

    public async Task<User?> GetByGoogleIdAsync(string googleId)
        => await AllNotDeletedUsers.FirstOrDefaultAsync(u => u.GoogleId == googleId);

    public async Task<User?> GetByResetTokenAsync(string token)
        => await AllNotDeletedUsers.FirstOrDefaultAsync(u => u.ResetToken == token);

    // ==================== CRUD & UTILITY ====================

    public async Task AddRoleToUserAsync(int userId, int roleId)
    {
        Console.WriteLine($"[UserRepository.AddRoleToUserAsync] Start - UserId: {userId}, RoleId: {roleId}");
        
        // Tái sử dụng method đã có để load user với roles
        var user = await GetByIdWithRolesAsync(userId);
        if (user == null)
        {
            Console.WriteLine($"[UserRepository.AddRoleToUserAsync] User not found: {userId}");
            throw new KeyNotFoundException("User not found or not active");
        }
        
        Console.WriteLine($"[UserRepository.AddRoleToUserAsync] User found. Current roles: [{string.Join(",", user.Roles.Select(r => r.RoleId))}]");

        // Kiểm tra user đã có role này chưa
        if (user.Roles.Any(r => r.RoleId == roleId))
        {
            Console.WriteLine($"[UserRepository.AddRoleToUserAsync] User already has role {roleId}");
            return; // Đã có role, không cần thêm
        }

        // Lấy role entity từ database (phải được tracked bởi EF Core)
        var role = await _context.Roles
            .FirstOrDefaultAsync(r => r.RoleId == roleId);
            
        if (role == null)
        {
            Console.WriteLine($"[UserRepository.AddRoleToUserAsync] Role not found: {roleId}");
            throw new KeyNotFoundException($"Role {roleId} not found");
        }
        
        Console.WriteLine($"[UserRepository.AddRoleToUserAsync] Adding role {roleId} to user {userId}");

        // Thêm role vào user's collection
        user.Roles.Add(role);
        
        // EF Core sẽ tự động insert vào bảng UserRoles
        var changes = await _context.SaveChangesAsync();
        Console.WriteLine($"[UserRepository.AddRoleToUserAsync] SaveChanges completed. Rows affected: {changes}");
    }

    public async Task CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<int> CountActiveUsersAsync()
        => await AllNotDeletedUsers.CountAsync();

    public async Task<int> CountInactiveUsersAsync()
        => await InactiveUsers.CountAsync();

    public async Task<int> CountDeletedUsersAsync()
        => await DeletedUsers.CountAsync();
}