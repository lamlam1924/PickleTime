namespace PickleTime.Api.Application.Contracts.OwnerProfile.Dtos
{
    public class OwnerRevenueDto
    {
        public string Period { get; set; } = null!; // "2025-01", "2025-W42", "2025-10-17"
        public decimal Revenue { get; set; }
        public int BookingsCount { get; set; }
        public int CompletedBookings { get; set; }
        public decimal AverageBookingValue { get; set; }
    }
}
