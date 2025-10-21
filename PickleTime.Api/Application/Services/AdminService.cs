using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.Admin;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly PickleTimeDbContext _context;

        public AdminService(PickleTimeDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            // User statistics
            var totalUsers = await _context.Users.CountAsync(u => !u.IsDeleted);
            var activeUsers = await _context.Users.CountAsync(u => !u.IsDeleted && u.StatusId == 1);
            var inactiveUsers = await _context.Users.CountAsync(u => !u.IsDeleted && u.StatusId == 2);
            
            // Count owners (RoleId = 2 for manager/owner based on your Roles table)
            var totalOwners = await _context.Users.CountAsync(u => !u.IsDeleted && u.RoleId == 2);

            // Facility statistics
            var totalFacilities = await _context.Facilities.CountAsync();
            var activeFacilities = await _context.Facilities.CountAsync(f => f.StatusId == 1);
            
            // Court (Turf) statistics
            var totalTurfs = await _context.Courts.CountAsync(c => !c.IsDeleted);

            // Booking statistics
            var totalBookings = await _context.Bookings.CountAsync();
            var todayBookings = await _context.Bookings.CountAsync(b => b.BookingDate == today);
            var pendingBookings = await _context.Bookings.CountAsync(b => b.BookingStatusId == 1);
            var completedBookings = await _context.Bookings.CountAsync(b => b.BookingStatusId == 3);

            // Revenue statistics
            var totalRevenue = await _context.Bookings
                .Where(b => b.PaymentStatusId == 2) // Paid
                .SumAsync(b => (decimal?)b.TotalAmount) ?? 0;
            
            var todayRevenue = await _context.Bookings
                .Where(b => b.BookingDate == today && b.PaymentStatusId == 2)
                .SumAsync(b => (decimal?)b.TotalAmount) ?? 0;

            // Request statistics (assuming you have owner request table - for now using placeholder)
            var pendingRequests = 0; // TODO: Add when OwnerRequest table is available
            var rejectedRequests = 0; // TODO: Add when OwnerRequest table is available

            // Recent bookings (last 5)
            var recentBookings = await _context.Bookings
                .Include(b => b.BookingStatus)
                .OrderByDescending(b => b.CreatedAt)
                .Take(5)
                .Select(b => new RecentBookingDto
                {
                    BookingId = b.BookingId,
                    BookingNumber = b.BookingNumber,
                    CustomerName = b.CustomerName,
                    BookingDate = b.BookingDate,
                    TotalAmount = b.TotalAmount,
                    Status = b.BookingStatus.StatusName
                })
                .ToListAsync();

            // Booking history for last 90 days (for chart)
            var startDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-90));
            var bookingHistoryRaw = await _context.Bookings
                .Where(b => b.BookingDate >= startDate && b.PaymentStatusId == 2)
                .GroupBy(b => b.BookingDate)
                .Select(g => new 
                {
                    Date = g.Key,
                    Amount = g.Sum(b => b.TotalAmount),
                    Count = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToListAsync();
            
            // Convert to DTO after query execution (client-side)
            var bookingHistory = bookingHistoryRaw.Select(x => new BookingHistoryDto
            {
                Date = x.Date.ToString("yyyy-MM-dd"),
                Amount = x.Amount,
                Count = x.Count
            }).ToList();

            return new DashboardStatsDto
            {
                // User stats
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                InactiveUsers = inactiveUsers,
                
                // Facility stats
                TotalFacilities = totalFacilities,
                ActiveFacilities = activeFacilities,
                TotalOwners = totalOwners,
                TotalTurfs = totalTurfs,
                
                // Booking stats
                TotalBookings = totalBookings,
                TodayBookings = todayBookings,
                PendingBookings = pendingBookings,
                CompletedBookings = completedBookings,
                
                // Revenue stats
                TotalRevenue = totalRevenue,
                TodayRevenue = todayRevenue,
                
                // Request stats
                PendingRequests = pendingRequests,
                RejectedRequests = rejectedRequests,
                
                // Recent data
                RecentBookings = recentBookings,
                BookingHistory = bookingHistory
            };
        }

        public async Task<List<OwnerListDto>> GetAllOwnersAsync()
        {
            var owners = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Status)
                .Where(u => !u.IsDeleted && u.RoleId == 2) // RoleId = 2 for Manager/Owner
                .Select(u => new OwnerListDto
                {
                    UserId = u.UserId,
                    UserName = u.UserName,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    RoleName = u.Role.RoleName,
                    StatusName = u.Status.StatusName,
                    MembershipType = u.MembershipType,
                    CreatedAt = u.CreatedAt,
                    LastLogin = u.LastLogin,
                    TotalFacilities = _context.Facilities
                        .Count(f => f.ManagerUserId == u.UserId && !f.IsDeleted),
                    TotalCourts = _context.Facilities
                        .Where(f => f.ManagerUserId == u.UserId && !f.IsDeleted)
                        .SelectMany(f => f.Courts)
                        .Count(c => !c.IsDeleted)
                })
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            return owners;
        }

        public async Task<List<UserListDto>> GetAllUsersAsync()
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Status)
                .Where(u => !u.IsDeleted)
                .Select(u => new UserListDto
                {
                    UserId = u.UserId,
                    UserName = u.UserName,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    RoleName = u.Role.RoleName,
                    StatusName = u.Status.StatusName,
                    MembershipType = u.MembershipType,
                    CreatedAt = u.CreatedAt,
                    LastLogin = u.LastLogin
                })
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            return users;
        }

        public async Task<UserListDto?> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Status)
                .Where(u => !u.IsDeleted && u.UserId == userId)
                .Select(u => new UserListDto
                {
                    UserId = u.UserId,
                    UserName = u.UserName,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    RoleName = u.Role.RoleName,
                    StatusName = u.Status.StatusName,
                    MembershipType = u.MembershipType,
                    CreatedAt = u.CreatedAt,
                    LastLogin = u.LastLogin
                })
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task<bool> UpdateUserStatusAsync(int userId, int statusId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.IsDeleted)
            {
                return false;
            }

            user.StatusId = statusId;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateUserAsync(int userId, UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.IsDeleted)
            {
                return false;
            }

            if (!string.IsNullOrEmpty(dto.FullName))
                user.FullName = dto.FullName;

            if (!string.IsNullOrEmpty(dto.Email))
                user.Email = dto.Email;

            if (!string.IsNullOrEmpty(dto.Phone))
                user.Phone = dto.Phone;

            if (!string.IsNullOrEmpty(dto.Address))
                user.Address = dto.Address;

            if (!string.IsNullOrEmpty(dto.MembershipType))
                user.MembershipType = dto.MembershipType;

            if (dto.RoleId.HasValue)
                user.RoleId = dto.RoleId.Value;

            if (dto.StatusId.HasValue)
                user.StatusId = dto.StatusId.Value;

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SoftDeleteUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.IsDeleted)
            {
                return false;
            }

            user.IsDeleted = true;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<UserListDto>> GetDeletedUsersAsync()
        {
            var deletedUsers = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Status)
                .Where(u => u.IsDeleted)
                .Select(u => new UserListDto
                {
                    UserId = u.UserId,
                    UserName = u.UserName,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    RoleName = u.Role.RoleName,
                    StatusName = u.Status.StatusName,
                    MembershipType = u.MembershipType,
                    CreatedAt = u.CreatedAt,
                    LastLogin = u.LastLogin
                })
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            return deletedUsers;
        }

        public async Task<bool> RestoreUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || !user.IsDeleted)
            {
                return false;
            }

            user.IsDeleted = false;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

