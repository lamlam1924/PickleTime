namespace PickleTime.Api.Application.Contracts.OwnerProfile.Dtos
{
    public class OwnerDashboardDto
    {
        // Revenue Statistics
        public decimal TotalRevenue { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public decimal WeeklyRevenue { get; set; }
        public decimal TodayRevenue { get; set; }
        
        // Booking Statistics
        public int TotalBookings { get; set; }
        public int CompletedBookings { get; set; }
        public int PendingBookings { get; set; }
        public int CancelledBookings { get; set; }
        public int TodayBookings { get; set; }
        
        // Facility Statistics
        public int TotalFacilities { get; set; }
        public int ActiveFacilities { get; set; }
        public int TotalCourts { get; set; }
        public int ActiveCourts { get; set; }
        
        // Review Statistics
        public int TotalReviews { get; set; }
        public double AverageRating { get; set; }
        
        // Recent Activity
        public DateTime? LastBookingDate { get; set; }
        public DateTime? LastReviewDate { get; set; }
        
        // Chart Data
        public List<BookingPerFacilityData> BookingsPerFacility { get; set; } = new();
        public List<RevenueOverTimeData> RevenueOverTime { get; set; } = new();
    }
    
    // Supporting classes for chart data
    public class BookingPerFacilityData
    {
        public string FacilityName { get; set; } = null!;
        public int TotalBookings { get; set; }
        public int CompletedBookings { get; set; }
        public int PendingBookings { get; set; }
    }
    
    public class RevenueOverTimeData
    {
        public DateTime Date { get; set; }
        public decimal Revenue { get; set; }
        public int BookingCount { get; set; }
    }
}
