using PickleTime.Api.Application.Contracts.OwnerProfile.Dtos;
using PickleTime.Api.Application.Contracts.Profile.Dtos;

namespace PickleTime.Api.Application.Contracts.OwnerProfile
{
    public interface IOwnerProfileService
    {
        // Profile Management
        Task<OwnerProfileDto> GetOwnerProfileAsync(int userId);
        Task<OwnerProfileDto> UpdateOwnerProfileAsync(int userId, UpdateOwnerProfileDto request);
        
        // Dashboard Statistics
        Task<OwnerDashboardDto> GetOwnerDashboardAsync(int userId);
        
        // Facilities Management
        Task<List<FacilitySummaryDto>> GetOwnerFacilitiesAsync(int userId);
        Task<FacilitySummaryDto> GetFacilityDetailsAsync(int userId, int facilityId);
        
        // Bookings Management
        Task<List<OwnerBookingDto>> GetOwnerBookingsAsync(int userId);
        
        // Revenue Analytics
        Task<List<OwnerRevenueDto>> GetRevenueByPeriodAsync(int userId, string periodType, int count);
        
        // Reviews Management
        Task<List<FacilityReviewDto>> GetFacilityReviewsAsync(int userId, int? facilityId = null, int page = 1, int pageSize = 10);
        
        // Password Change (reuse from Profile)
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto request);
    }
}
