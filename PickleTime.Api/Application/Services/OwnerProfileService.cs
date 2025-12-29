using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.OwnerProfile;
using PickleTime.Api.Application.Contracts.OwnerProfile.Dtos;
using PickleTime.Api.Application.Contracts.Profile.Dtos;
using PickleTime.Api.Infrastructure.Data;
using System.Text.RegularExpressions;
using BCrypt.Net;
using PickleTime.Api.Application.Contracts.Auth;
using PickleTime.Api.Common.Helpers;

namespace PickleTime.Api.Application.Services
{
    public class OwnerProfileService : IOwnerProfileService
    {
        private readonly PickleTimeDbContext _context;
        private readonly IUserRepository _userRepository;

        public OwnerProfileService(PickleTimeDbContext context, IUserRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        // ==================== Profile Management ====================

        public async Task<OwnerProfileDto> GetOwnerProfileAsync(int userId)
        {
            var user = await _userRepository.GetByIdWithRolesAsync(userId)
                       ?? throw new KeyNotFoundException("Owner not found or access denied");
            
            // Count facilities managed by this owner
            var totalFacilities = await _context.Facilities
                .Where(f => f.ManagerUserId == userId && !f.IsDeleted)
                .CountAsync();

            var activeFacilities = await _context.Facilities
                .Where(f => f.ManagerUserId == userId && !f.IsDeleted && f.StatusId == 1)
                .CountAsync();

            return new OwnerProfileDto
            {
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                FullName = user.FullName,
                Phone = user.Phone,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender,
                Address = user.Address,
                // Role = user.Role?.RoleName ?? "Manager",
                Role = RoleHelper.GetDisplayName(user.Roles),
                CreatedAt = user.CreatedAt,
                Avatar = user.Avatar,
                GoogleId = user.GoogleId,
                TotalFacilities = totalFacilities,
                ActiveFacilities = activeFacilities,
                LastLoginAt = user.UpdatedAt
            };
        }

        public async Task<OwnerProfileDto> UpdateOwnerProfileAsync(int userId, UpdateOwnerProfileDto request)
        {
            var user = await _context.Users
                .Where(u => u.UserId == userId && !u.IsDeleted && u.Roles.Any(r => r.RoleId == 2))
                .FirstOrDefaultAsync();

            if (user == null)
                throw new KeyNotFoundException("Owner not found or access denied");

            // Validation
            if (!string.IsNullOrEmpty(request.Phone))
            {
                if (!Regex.IsMatch(request.Phone, @"^[0-9]{10,11}$"))
                    throw new ArgumentException("Số điện thoại phải có 10-11 chữ số");
            }

            if (request.DateOfBirth.HasValue)
            {
                var age = DateTime.Now.Year - request.DateOfBirth.Value.Year;
                if (age < 18)
                    throw new ArgumentException("Chủ sân phải từ 18 tuổi trở lên");
            }

            if (!string.IsNullOrEmpty(request.Gender) && !new[] { "Nam", "Nữ", "Khác" }.Contains(request.Gender))
            {
                throw new ArgumentException("Giới tính không hợp lệ");
            }

            // Update fields
            if (request.FullName != null) user.FullName = request.FullName;
            if (request.Phone != null) user.Phone = request.Phone;
            if (request.DateOfBirth.HasValue) user.DateOfBirth = request.DateOfBirth;
            if (request.Gender != null) user.Gender = request.Gender;
            if (request.Address != null) user.Address = request.Address;

            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return await GetOwnerProfileAsync(userId);
        }

        // ==================== Dashboard Statistics ====================

        public async Task<OwnerDashboardDto> GetOwnerDashboardAsync(int userId)
        {
            // Get all facility IDs managed by this owner
            var facilityIds = await _context.Facilities
                .Where(f => f.ManagerUserId == userId && !f.IsDeleted)
                .Select(f => f.FacilityId)
                .ToListAsync();

            if (!facilityIds.Any())
            {
                return new OwnerDashboardDto(); // Return empty stats
            }

            // Get all bookings for owner's facilities
            var allBookings = await _context.Bookings
                .Include(b => b.BookingDetails)
                .Where(b => !b.IsDeleted && b.BookingDetails.Any(bd =>
                    bd.Court != null && facilityIds.Contains(bd.Court.FacilityId)))
                .ToListAsync();

            var now = DateTime.Now;
            var today = DateOnly.FromDateTime(now);
            var weekStart = now.AddDays(-(int)now.DayOfWeek);
            var monthStart = new DateTime(now.Year, now.Month, 1);

            // Revenue calculations (only completed bookings with payment)
            var completedBookings = allBookings.Where(b => b.BookingStatusId == 2 && b.PaymentStatusId == 2).ToList();

            var totalRevenue = completedBookings.Sum(b => b.FinalAmount ?? b.TotalAmount);
            var monthlyRevenue = completedBookings
                .Where(b => b.BookingDate >= DateOnly.FromDateTime(monthStart))
                .Sum(b => b.FinalAmount ?? b.TotalAmount);
            var weeklyRevenue = completedBookings
                .Where(b => b.BookingDate >= DateOnly.FromDateTime(weekStart))
                .Sum(b => b.FinalAmount ?? b.TotalAmount);
            var todayRevenue = completedBookings
                .Where(b => b.BookingDate == today)
                .Sum(b => b.FinalAmount ?? b.TotalAmount);

            // Booking statistics
            var totalBookings = allBookings.Count;
            var completed = allBookings.Count(b => b.BookingStatusId == 2);
            var pending = allBookings.Count(b => b.BookingStatusId == 1);
            var cancelled = allBookings.Count(b => b.BookingStatusId == 3);
            var todayBookings = allBookings.Count(b => b.BookingDate == today);

            // Facility statistics
            var facilities = await _context.Facilities
                .Where(f => facilityIds.Contains(f.FacilityId))
                .ToListAsync();

            var totalFacilities = facilities.Count;
            var activeFacilities = facilities.Count(f => f.StatusId == 1);

            var courts = await _context.Courts
                .Where(c => facilityIds.Contains(c.FacilityId) && !c.IsDeleted)
                .ToListAsync();

            var totalCourts = courts.Count;
            var activeCourts = courts.Count(c => c.StatusId == 1);

            // Review statistics
            var reviews = await _context.Reviews
                .Where(r => facilityIds.Contains(r.FacilityId) && !r.IsDeleted)
                .ToListAsync();

            var totalReviews = reviews.Count;
            var averageRating = totalReviews > 0 ? reviews.Average(r => r.Rating) : 0;

            // Recent activity
            var lastBookingDate = allBookings.Any() ? allBookings.Max(b => b.CreatedAt) : (DateTime?)null;
            var lastReviewDate = reviews.Any() ? reviews.Max(r => r.ReviewDate) : (DateTime?)null;

            // ==================== Chart Data ====================

            // 1. Bookings Per Facility
            var bookingsPerFacility = new List<BookingPerFacilityData>();
            foreach (var facility in facilities)
            {
                var facilityBookings = await _context.Bookings
                    .Include(b => b.BookingDetails)
                    .Where(b => !b.IsDeleted && b.BookingDetails.Any(bd =>
                        bd.Court != null && bd.Court.FacilityId == facility.FacilityId))
                    .ToListAsync();

                bookingsPerFacility.Add(new BookingPerFacilityData
                {
                    FacilityName = facility.FacilityName,
                    TotalBookings = facilityBookings.Count,
                    CompletedBookings = facilityBookings.Count(b => b.BookingStatusId == 2),
                    PendingBookings = facilityBookings.Count(b => b.BookingStatusId == 1)
                });
            }

            // 2. Revenue Over Time (Last 30 days)
            var revenueOverTime = new List<RevenueOverTimeData>();
            var startDate = DateTime.Now.AddDays(-6).Date; // Last 7 days including today

            for (int i = 0; i < 7; i++)
            {
                var targetDate = startDate.AddDays(i);
                var targetDateOnly = DateOnly.FromDateTime(targetDate);

                var dayBookings = completedBookings
                    .Where(b => b.BookingDate == targetDateOnly)
                    .ToList();

                revenueOverTime.Add(new RevenueOverTimeData
                {
                    Date = targetDate,
                    Revenue = dayBookings.Sum(b => b.FinalAmount ?? b.TotalAmount),
                    BookingCount = dayBookings.Count
                });
            }

            return new OwnerDashboardDto
            {
                TotalRevenue = totalRevenue,
                MonthlyRevenue = monthlyRevenue,
                WeeklyRevenue = weeklyRevenue,
                TodayRevenue = todayRevenue,
                TotalBookings = totalBookings,
                CompletedBookings = completed,
                PendingBookings = pending,
                CancelledBookings = cancelled,
                TodayBookings = todayBookings,
                TotalFacilities = totalFacilities,
                ActiveFacilities = activeFacilities,
                TotalCourts = totalCourts,
                ActiveCourts = activeCourts,
                TotalReviews = totalReviews,
                AverageRating = averageRating,
                LastBookingDate = lastBookingDate,
                LastReviewDate = lastReviewDate,
                BookingsPerFacility = bookingsPerFacility,
                RevenueOverTime = revenueOverTime
            };
        }

        // ==================== Facilities Management ====================

        public async Task<List<FacilitySummaryDto>> GetOwnerFacilitiesAsync(int userId)
        {
            var facilities = await _context.Facilities
                .Include(f => f.Status)
                .Include(f => f.Courts)
                .Where(f => f.ManagerUserId == userId && !f.IsDeleted)
                .ToListAsync();

            var result = new List<FacilitySummaryDto>();

            foreach (var facility in facilities)
            {
                var facilityId = facility.FacilityId;

                // Get courts for this facility
                var courts = facility.Courts.Where(c => !c.IsDeleted).ToList();
                var activeCourts = courts.Count(c => c.StatusId == 1);

                // Get bookings for this facility
                var bookings = await _context.Bookings
                    .Include(b => b.BookingDetails)
                    .Where(b => !b.IsDeleted && b.BookingDetails.Any(bd =>
                        bd.Court != null && bd.Court.FacilityId == facilityId))
                    .ToListAsync();

                var completedBookings = bookings.Where(b => b.BookingStatusId == 2).ToList();
                var totalRevenue = completedBookings
                    .Where(b => b.PaymentStatusId == 2)
                    .Sum(b => b.FinalAmount ?? b.TotalAmount);

                // Get reviews for this facility
                var reviews = await _context.Reviews
                    .Where(r => r.FacilityId == facilityId && !r.IsDeleted)
                    .ToListAsync();

                var averageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;

                result.Add(new FacilitySummaryDto
                {
                    FacilityId = facility.FacilityId,
                    FacilityName = facility.FacilityName,
                    Address = $"{facility.Address}, {facility.Ward}, {facility.District}, {facility.Province}",
                    Phone = facility.Phone,
                    Email = facility.Email,
                    Status = facility.Status?.StatusName ?? "Unknown",
                    TotalCourts = courts.Count,
                    ActiveCourts = activeCourts,
                    TotalBookings = bookings.Count,
                    CompletedBookings = completedBookings.Count,
                    TotalRevenue = totalRevenue,
                    TotalReviews = reviews.Count,
                    AverageRating = averageRating,
                    CreatedAt = facility.CreatedAt,
                    UpdatedAt = facility.UpdatedAt
                });
            }

            return result;
        }

        public async Task<FacilitySummaryDto> GetFacilityDetailsAsync(int userId, int facilityId)
        {
            var facility = await _context.Facilities
                .Include(f => f.Status)
                .Include(f => f.Courts)
                .Where(f => f.FacilityId == facilityId && f.ManagerUserId == userId && !f.IsDeleted)
                .FirstOrDefaultAsync();

            if (facility == null)
                throw new KeyNotFoundException("Facility not found or access denied");

            var courts = facility.Courts.Where(c => !c.IsDeleted).ToList();
            var activeCourts = courts.Count(c => c.StatusId == 1);

            var bookings = await _context.Bookings
                .Include(b => b.BookingDetails)
                .Where(b => !b.IsDeleted && b.BookingDetails.Any(bd =>
                    bd.Court != null && bd.Court.FacilityId == facilityId))
                .ToListAsync();

            var completedBookings = bookings.Where(b => b.BookingStatusId == 2).ToList();
            var totalRevenue = completedBookings
                .Where(b => b.PaymentStatusId == 2)
                .Sum(b => b.FinalAmount ?? b.TotalAmount);

            var reviews = await _context.Reviews
                .Where(r => r.FacilityId == facilityId && !r.IsDeleted)
                .ToListAsync();

            var averageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;

            return new FacilitySummaryDto
            {
                FacilityId = facility.FacilityId,
                FacilityName = facility.FacilityName,
                Address = $"{facility.Address}, {facility.Ward}, {facility.District}, {facility.Province}",
                Phone = facility.Phone,
                Email = facility.Email,
                Status = facility.Status?.StatusName ?? "Unknown",
                TotalCourts = courts.Count,
                ActiveCourts = activeCourts,
                TotalBookings = bookings.Count,
                CompletedBookings = completedBookings.Count,
                TotalRevenue = totalRevenue,
                TotalReviews = reviews.Count,
                AverageRating = averageRating,
                CreatedAt = facility.CreatedAt,
                UpdatedAt = facility.UpdatedAt
            };
        }

        // ==================== Bookings Management ====================

        public async Task<List<OwnerBookingDto>> GetOwnerBookingsAsync(int userId)
        {
            // Get all facility IDs managed by this owner
            var facilityIds = await _context.Facilities
                .Where(f => f.ManagerUserId == userId && !f.IsDeleted)
                .Select(f => f.FacilityId)
                .ToListAsync();

            if (!facilityIds.Any())
                return new List<OwnerBookingDto>();

            // Get all bookings for these facilities
            var bookings = await _context.Bookings
                .Include(b => b.BookingStatus)
                .Include(b => b.PaymentStatus)
                .Include(b => b.BookingDetails)
                .ThenInclude(bd => bd.Court)
                .ThenInclude(c => c!.Facility)
                .Where(b => !b.IsDeleted &&
                            b.BookingDetails.Any(bd => bd.Court != null && facilityIds.Contains(bd.Court.FacilityId)))
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();

            var result = new List<OwnerBookingDto>();

            foreach (var booking in bookings)
            {
                // Get first booking detail for facility/court info
                var firstDetail = booking.BookingDetails.FirstOrDefault();
                if (firstDetail?.Court == null) continue;

                result.Add(new OwnerBookingDto
                {
                    BookingId = booking.BookingId,
                    BookingNumber = booking.BookingNumber,
                    BookingDate = booking.BookingDate.ToDateTime(TimeOnly.MinValue),
                    CustomerName = booking.CustomerName,
                    CustomerEmail = booking.CustomerEmail ?? "",
                    CustomerPhone = booking.CustomerPhone,
                    FacilityId = firstDetail.Court.FacilityId,
                    FacilityName = firstDetail.Court.Facility?.FacilityName ?? "Unknown",
                    CourtName = firstDetail.Court.CourtName,
                    SlotDate = firstDetail.SlotDate,
                    StartTime = firstDetail.StartTime,
                    EndTime = firstDetail.EndTime,
                    BookingStatus = booking.BookingStatus?.StatusName ?? "Unknown",
                    PaymentStatus = booking.PaymentStatus?.StatusName ?? "Pending",
                    TotalAmount = booking.TotalAmount,
                    DiscountAmount = booking.DiscountAmount,
                    FinalAmount = booking.FinalAmount ?? booking.TotalAmount,
                    Notes = booking.Notes,
                    CreatedAt = booking.CreatedAt
                });
            }

            return result;
        }

        // ==================== Revenue Analytics ====================

        public async Task<List<OwnerRevenueDto>> GetRevenueByPeriodAsync(int userId, string periodType, int count)
        {
            var facilityIds = await _context.Facilities
                .Where(f => f.ManagerUserId == userId && !f.IsDeleted)
                .Select(f => f.FacilityId)
                .ToListAsync();

            if (!facilityIds.Any())
                return new List<OwnerRevenueDto>();

            var bookings = await _context.Bookings
                .Include(b => b.BookingDetails)
                .Where(b => !b.IsDeleted &&
                            b.BookingStatusId == 2 &&
                            b.PaymentStatusId == 2 &&
                            b.BookingDetails.Any(bd => bd.Court != null && facilityIds.Contains(bd.Court.FacilityId)))
                .ToListAsync();

            var result = new List<OwnerRevenueDto>();

            if (periodType.ToLower() == "monthly")
            {
                var groupedByMonth = bookings
                    .GroupBy(b => new { b.BookingDate.Year, b.BookingDate.Month })
                    .OrderByDescending(g => g.Key.Year).ThenByDescending(g => g.Key.Month)
                    .Take(count);

                foreach (var group in groupedByMonth)
                {
                    var bookingsList = group.ToList();
                    var revenue = bookingsList.Sum(b => b.FinalAmount ?? b.TotalAmount);

                    result.Add(new OwnerRevenueDto
                    {
                        Period = $"{group.Key.Year}-{group.Key.Month:D2}",
                        Revenue = revenue,
                        BookingsCount = bookingsList.Count,
                        CompletedBookings = bookingsList.Count,
                        AverageBookingValue = bookingsList.Count > 0 ? revenue / bookingsList.Count : 0
                    });
                }
            }
            else if (periodType.ToLower() == "daily")
            {
                var groupedByDay = bookings
                    .GroupBy(b => b.BookingDate)
                    .OrderByDescending(g => g.Key)
                    .Take(count);

                foreach (var group in groupedByDay)
                {
                    var bookingsList = group.ToList();
                    var revenue = bookingsList.Sum(b => b.FinalAmount ?? b.TotalAmount);

                    result.Add(new OwnerRevenueDto
                    {
                        Period = group.Key.ToString("yyyy-MM-dd"),
                        Revenue = revenue,
                        BookingsCount = bookingsList.Count,
                        CompletedBookings = bookingsList.Count,
                        AverageBookingValue = bookingsList.Count > 0 ? revenue / bookingsList.Count : 0
                    });
                }
            }

            return result;
        }

        // ==================== Reviews Management ====================

        public async Task<List<FacilityReviewDto>> GetFacilityReviewsAsync(int userId, int? facilityId = null,
            int page = 1, int pageSize = 10)
        {
            var facilityIds = await _context.Facilities
                .Where(f => f.ManagerUserId == userId && !f.IsDeleted)
                .Select(f => f.FacilityId)
                .ToListAsync();

            if (!facilityIds.Any())
                return new List<FacilityReviewDto>();

            var query = _context.Reviews
                .Include(r => r.Facility)
                .Include(r => r.User)
                .Include(r => r.ReviewStatus)
                .Where(r => !r.IsDeleted && facilityIds.Contains(r.FacilityId));

            if (facilityId.HasValue)
            {
                query = query.Where(r => r.FacilityId == facilityId.Value);
            }

            var reviews = await query
                .OrderByDescending(r => r.ReviewDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return reviews.Select(r => new FacilityReviewDto
            {
                ReviewId = r.ReviewId,
                FacilityId = r.FacilityId,
                FacilityName = r.Facility?.FacilityName ?? "Unknown",
                CustomerName = r.User?.FullName ?? r.User?.UserName ?? "Anonymous",
                Rating = r.Rating,
                Comment = r.Comment,
                Status = r.ReviewStatus?.StatusName ?? "Unknown",
                CreatedAt = r.ReviewDate,
                UpdatedAt = r.ReviewDate
            }).ToList();
        }

        // ==================== Password Change ====================

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto request)
        {
            var user = await _userRepository.GetByIdWithRolesAsync(userId)
                       ?? throw new KeyNotFoundException("Owner not found");

            // Check if user logged in with Google
            if (!string.IsNullOrEmpty(user.GoogleId))
                throw new InvalidOperationException("Không thể đổi mật khẩu cho tài khoản Google");

            // Validate new password
            if (request.NewPassword.Length < 6)
                throw new ArgumentException("Mật khẩu mới phải có ít nhất 6 ký tự");

            if (request.NewPassword != request.ConfirmPassword)
                throw new ArgumentException("Mật khẩu xác nhận không khớp");

            // Verify current password
            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PassWord))
                return false;

            // Hash and update new password
            user.PassWord = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}