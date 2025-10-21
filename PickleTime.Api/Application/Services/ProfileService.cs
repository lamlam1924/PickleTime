using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.Profile;
using PickleTime.Api.Application.Contracts.Profile.Dtos;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Application.Services;

public class ProfileService : IProfileService
{
    private readonly PickleTimeDbContext _context;

    public ProfileService(PickleTimeDbContext context)
    {
        _context = context;
    }

    public async Task<ProfileDto> GetProfileAsync(int userId)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.UserId == userId && !u.IsDeleted);

        if (user == null)
            throw new KeyNotFoundException($"User with ID {userId} not found");

        return new ProfileDto
        {
            UserId = user.UserId,
            UserName = user.UserName,
            Email = user.Email,
            Phone = user.Phone,
            FullName = user.FullName,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            Address = user.Address,
            Avatar = user.Avatar,
            RoleName = user.Role?.RoleName ?? "",
            MembershipType = user.MembershipType,
            LastLogin = user.LastLogin,
            CreatedAt = user.CreatedAt,
            GoogleId = user.GoogleId
        };
    }

    public async Task<ProfileDto> UpdateProfileAsync(int userId, UpdateProfileDto request)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.UserId == userId && !u.IsDeleted);

        if (user == null)
            throw new KeyNotFoundException($"User with ID {userId} not found");

        // Update only provided fields
        if (!string.IsNullOrWhiteSpace(request.FullName))
            user.FullName = request.FullName.Trim();

        if (!string.IsNullOrWhiteSpace(request.Phone))
        {
            // Validate phone number format
            if (!System.Text.RegularExpressions.Regex.IsMatch(request.Phone, @"^[0-9]{10,11}$"))
                throw new ArgumentException("Số điện thoại không hợp lệ! (10-11 chữ số)");
            user.Phone = request.Phone.Trim();
        }

        if (request.DateOfBirth.HasValue)
        {
            // Validate age (must be at least 13 years old)
            var age = DateTime.Now.Year - request.DateOfBirth.Value.Year;
            if (age < 13)
                throw new ArgumentException("Bạn phải ít nhất 13 tuổi!");
            user.DateOfBirth = request.DateOfBirth;
        }

        if (!string.IsNullOrWhiteSpace(request.Gender))
        {
            var validGenders = new[] { "Nam", "Nữ", "Khác" };
            if (!validGenders.Contains(request.Gender))
                throw new ArgumentException("Giới tính không hợp lệ!");
            user.Gender = request.Gender;
        }

        if (!string.IsNullOrWhiteSpace(request.Address))
            user.Address = request.Address.Trim();

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return await GetProfileAsync(userId);
    }

    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == userId && !u.IsDeleted);

        if (user == null)
            throw new KeyNotFoundException($"User with ID {userId} not found");

        // Check if user logged in with Google
        if (!string.IsNullOrEmpty(user.GoogleId))
            throw new ArgumentException("Không thể đổi mật khẩu cho tài khoản Google!");

        // Validate new password
        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
            throw new ArgumentException("Mật khẩu mới phải có ít nhất 6 ký tự!");

        if (request.NewPassword != request.ConfirmPassword)
            throw new ArgumentException("Mật khẩu xác nhận không khớp!");

        // Verify current password
        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PassWord))
            return false;

        // Hash and update new password
        user.PassWord = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<BookingHistoryDto>> GetBookingHistoryAsync(int userId, int page, int pageSize)
    {
        var bookings = await _context.Bookings
            .Include(b => b.BookingDetails)
                .ThenInclude(bd => bd.Court)
                    .ThenInclude(c => c.Facility)
            .Include(b => b.BookingStatus)
            .Include(b => b.PaymentStatus)
            .Where(b => b.UserId == userId && !b.IsDeleted)
            .OrderByDescending(b => b.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return bookings.Select(b =>
        {
            var firstDetail = b.BookingDetails.FirstOrDefault();
            var court = firstDetail?.Court;
            var facility = court?.Facility;

            return new BookingHistoryDto
            {
                BookingId = b.BookingId,
                BookingNumber = b.BookingNumber,
                BookingDate = b.BookingDate,
                FacilityName = facility?.FacilityName ?? "N/A",
                CourtName = court?.CourtName ?? "N/A",
                StartTime = firstDetail?.StartTime ?? TimeOnly.MinValue,
                EndTime = firstDetail?.EndTime ?? TimeOnly.MinValue,
                TotalAmount = b.TotalAmount,
                BookingStatus = b.BookingStatus?.StatusName ?? "Unknown",
                PaymentStatus = b.PaymentStatus?.StatusName ?? "Unknown",
                CreatedAt = b.CreatedAt
            };
        }).ToList();
    }

    public async Task<UserStatisticsDto> GetUserStatisticsAsync(int userId)
    {
        var bookings = await _context.Bookings
            .Include(b => b.BookingStatus)
            .Where(b => b.UserId == userId && !b.IsDeleted)
            .ToListAsync();

        var reviews = await _context.Reviews
            .Where(r => r.UserId == userId && !r.IsDeleted)
            .ToListAsync();

        var totalBookings = bookings.Count;
        var completedBookings = bookings.Count(b => b.BookingStatus?.StatusName?.ToLower() == "completed");
        var cancelledBookings = bookings.Count(b => b.BookingStatus?.StatusName?.ToLower() == "cancelled");
        var pendingBookings = bookings.Count(b => b.BookingStatus?.StatusName?.ToLower() == "pending");
        var totalSpent = bookings.Where(b => b.BookingStatus?.StatusName?.ToLower() == "completed").Sum(b => b.FinalAmount ?? b.TotalAmount);
        var totalReviews = reviews.Count;
        var averageRating = totalReviews > 0 ? reviews.Average(r => (decimal?)r.Rating) : null;

        return new UserStatisticsDto
        {
            TotalBookings = totalBookings,
            CompletedBookings = completedBookings,
            CancelledBookings = cancelledBookings,
            PendingBookings = pendingBookings,
            TotalSpent = totalSpent,
            TotalReviews = totalReviews,
            AverageRating = averageRating
        };
    }

    public async Task<bool> DeactivateAccountAsync(int userId, string password)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == userId && !u.IsDeleted);

        if (user == null)
            throw new KeyNotFoundException($"User with ID {userId} not found");

        // Check if user logged in with Google - skip password check
        if (string.IsNullOrEmpty(user.GoogleId))
        {
            // Verify password for email/password accounts
            if (!BCrypt.Net.BCrypt.Verify(password, user.PassWord))
                return false;
        }

        // Soft delete the user
        user.IsDeleted = true;
        user.StatusId = 2; // Inactive
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }
}
