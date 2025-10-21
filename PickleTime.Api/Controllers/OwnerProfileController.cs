using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contracts.OwnerProfile;
using PickleTime.Api.Application.Contracts.OwnerProfile.Dtos;
using PickleTime.Api.Application.Contracts.Profile.Dtos;
using System.Security.Claims;

namespace PickleTime.Api.Controllers
{
    [ApiController]
    [Route("api/owner/profile")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Manager,manager")]
    public class OwnerProfileController : ControllerBase
    {
        private readonly IOwnerProfileService _ownerProfileService;

        public OwnerProfileController(IOwnerProfileService ownerProfileService)
        {
            _ownerProfileService = ownerProfileService;
        }

        // Helper method to get current user ID from JWT token
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
                return userId;
            throw new UnauthorizedAccessException("Unable to determine current user ID");
        }

        // ==================== Profile Management ====================

        /// <summary>
        /// Get owner profile information
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetOwnerProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _ownerProfileService.GetOwnerProfileAsync(userId);
                return Ok(new { success = true, data = profile });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update owner profile
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateOwnerProfile([FromBody] UpdateOwnerProfileDto request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _ownerProfileService.UpdateOwnerProfileAsync(userId, request);
                return Ok(new { success = true, data = profile, message = "Cập nhật thông tin thành công" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ==================== Dashboard Statistics ====================

        /// <summary>
        /// Get owner dashboard statistics
        /// </summary>
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetOwnerDashboard()
        {
            try
            {
                var userId = GetCurrentUserId();
                var dashboard = await _ownerProfileService.GetOwnerDashboardAsync(userId);
                return Ok(new { success = true, data = dashboard });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ==================== Facilities Management ====================

        /// <summary>
        /// Get all facilities managed by owner (alias for turfs)
        /// </summary>
        [HttpGet("turfs")]
        public async Task<IActionResult> GetOwnerTurfs()
        {
            try
            {
                var userId = GetCurrentUserId();
                var facilities = await _ownerProfileService.GetOwnerFacilitiesAsync(userId);
                return Ok(new { success = true, data = facilities });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get all facilities managed by owner
        /// </summary>
        [HttpGet("facilities")]
        public async Task<IActionResult> GetOwnerFacilities()
        {
            try
            {
                var userId = GetCurrentUserId();
                var facilities = await _ownerProfileService.GetOwnerFacilitiesAsync(userId);
                return Ok(new { success = true, data = facilities });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get specific facility details
        /// </summary>
        [HttpGet("facilities/{facilityId}")]
        public async Task<IActionResult> GetFacilityDetails(int facilityId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var facility = await _ownerProfileService.GetFacilityDetailsAsync(userId, facilityId);
                return Ok(new { success = true, data = facility });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ==================== Bookings Management ====================

        /// <summary>
        /// Get all bookings for owner's facilities
        /// </summary>
        [HttpGet("bookings")]
        public async Task<IActionResult> GetOwnerBookings()
        {
            try
            {
                var userId = GetCurrentUserId();
                var bookings = await _ownerProfileService.GetOwnerBookingsAsync(userId);
                return Ok(new { success = true, data = bookings });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ==================== Revenue Analytics ====================

        /// <summary>
        /// Get revenue by period (monthly or daily)
        /// </summary>
        /// <param name="periodType">monthly or daily</param>
        /// <param name="count">number of periods to return</param>
        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenueByPeriod([FromQuery] string periodType = "monthly", [FromQuery] int count = 12)
        {
            try
            {
                var userId = GetCurrentUserId();
                var revenue = await _ownerProfileService.GetRevenueByPeriodAsync(userId, periodType, count);
                return Ok(new { success = true, data = revenue });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ==================== Reviews Management ====================

        /// <summary>
        /// Get facilities with their reviews (for review management page)
        /// </summary>
        [HttpGet("turfs-with-reviews")]
        public async Task<IActionResult> GetTurfsWithReviews()
        {
            try
            {
                var userId = GetCurrentUserId();
                var facilities = await _ownerProfileService.GetOwnerFacilitiesAsync(userId);
                
                // Transform to match frontend expectations
                var result = facilities.Select(f => new
                {
                    id = f.FacilityId,
                    name = f.FacilityName,
                    avgRating = f.AverageRating,
                    totalRatings = f.TotalReviews
                }).ToList();
                
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get reviews for owner's facilities
        /// </summary>
        /// <param name="facilityId">Optional: filter by specific facility</param>
        /// <param name="page">Page number</param>
        /// <param name="pageSize">Items per page</param>
        [HttpGet("reviews")]
        public async Task<IActionResult> GetFacilityReviews([FromQuery] int? facilityId = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var userId = GetCurrentUserId();
                var reviews = await _ownerProfileService.GetFacilityReviewsAsync(userId, facilityId, page, pageSize);
                return Ok(new { success = true, data = reviews });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ==================== Password Change ====================

        /// <summary>
        /// Change owner password
        /// </summary>
        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var success = await _ownerProfileService.ChangePasswordAsync(userId, request);
                
                if (!success)
                    return BadRequest(new { success = false, message = "Mật khẩu hiện tại không đúng" });

                return Ok(new { success = true, message = "Đổi mật khẩu thành công" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
