namespace PickleTime.Api.Application.Contracts.OwnerProfile.Dtos
{
    public class OwnerBookingDto
    {
        public int BookingId { get; set; }
        public string BookingNumber { get; set; } = null!;
        public DateTime BookingDate { get; set; }
        
        // Customer Info
        public string CustomerName { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public string? CustomerPhone { get; set; }
        
        // Facility & Court Info
        public int FacilityId { get; set; }
        public string FacilityName { get; set; } = null!;
        public string CourtName { get; set; } = null!;
        
        // Booking Details
        public DateOnly SlotDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        
        // Status
        public string BookingStatus { get; set; } = null!;
        public string PaymentStatus { get; set; } = null!;
        
        // Financial
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal FinalAmount { get; set; }
        
        // Additional Info
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
