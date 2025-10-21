using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contracts.Profile;
using PickleTime.Api.Application.Contracts.Profile.Dtos;
using System.Security.Claims;

namespace PickleTime.Api.Controllers
{
    [ApiController]
    [Route("api/profile")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        // Helper method to get current user ID from JWT token
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
                return userId;
            throw new UnauthorizedAccessException("Unable to determine current user ID");
        }

        /// <summary>
        /// Get current user's profile
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _profileService.GetProfileAsync(userId);
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
        /// Update current user's profile (basic info)
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var updatedProfile = await _profileService.UpdateProfileAsync(userId, request);
                return Ok(new { success = true, data = updatedProfile, message = "Cập nhật thông tin thành công!" });
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

        /// <summary>
        /// Change password for current user
        /// </summary>
        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _profileService.ChangePasswordAsync(userId, request);
                
                if (result)
                    return Ok(new { success = true, message = "Đổi mật khẩu thành công!" });
                
                return BadRequest(new { success = false, message = "Mật khẩu hiện tại không đúng!" });
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

        /// <summary>
        /// Get user's booking history
        /// </summary>
        [HttpGet("booking-history")]
        public async Task<IActionResult> GetBookingHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var userId = GetCurrentUserId();
                var bookings = await _profileService.GetBookingHistoryAsync(userId, page, pageSize);
                return Ok(new { success = true, data = bookings });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get user's statistics (total bookings, reviews, etc.)
        /// </summary>
        [HttpGet("statistics")]
        public async Task<IActionResult> GetUserStatistics()
        {
            try
            {
                var userId = GetCurrentUserId();
                var stats = await _profileService.GetUserStatisticsAsync(userId);
                return Ok(new { success = true, data = stats });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Deactivate account (soft delete)
        /// </summary>
        [HttpDelete]
        public async Task<IActionResult> DeactivateAccount([FromBody] DeactivateAccountDto request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _profileService.DeactivateAccountAsync(userId, request.Password);
                
                if (result)
                    return Ok(new { success = true, message = "Tài khoản đã được vô hiệu hóa!" });
                
                return BadRequest(new { success = false, message = "Mật khẩu không đúng!" });
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
    }
}
