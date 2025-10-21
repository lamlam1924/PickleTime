namespace PickleTime.Api.Application.Contracts.Admin
{
    public class DashboardStatsDto
    {
        // User Statistics
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int InactiveUsers { get; set; }
        
        // Facility Statistics
        public int TotalFacilities { get; set; }
        public int ActiveFacilities { get; set; }
        public int TotalOwners { get; set; }
        public int TotalTurfs { get; set; }
        
        // Booking Statistics
        public int TotalBookings { get; set; }
        public int TodayBookings { get; set; }
        public int PendingBookings { get; set; }
        public int CompletedBookings { get; set; }
        
        // Revenue Statistics
        public decimal TotalRevenue { get; set; }
        public decimal TodayRevenue { get; set; }
        
        // Request Statistics
        public int PendingRequests { get; set; }
        public int RejectedRequests { get; set; }
        
        // Recent Data
        public List<RecentBookingDto> RecentBookings { get; set; } = new();
        public List<BookingHistoryDto> BookingHistory { get; set; } = new();
    }

    public class RecentBookingDto
    {
        public int BookingId { get; set; }
        public string BookingNumber { get; set; } = null!;
        public string CustomerName { get; set; } = null!;
        public DateOnly BookingDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = null!;
    }

    public class BookingHistoryDto
    {
        public string Date { get; set; } = null!;
        public decimal Amount { get; set; }
        public int Count { get; set; }
    }

    public class UserListDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string RoleName { get; set; } = null!;
        public string StatusName { get; set; } = null!;
        public string? MembershipType { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
    }

    public class OwnerListDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string RoleName { get; set; } = null!;
        public string StatusName { get; set; } = null!;
        public string? MembershipType { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
        public int TotalFacilities { get; set; }
        public int TotalCourts { get; set; }
    }

    public class UpdateUserStatusDto
    {
        public int StatusId { get; set; }
    }

    public class UpdateUserDto
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? MembershipType { get; set; }
        public int? RoleId { get; set; }
        public int? StatusId { get; set; }
    }
}

