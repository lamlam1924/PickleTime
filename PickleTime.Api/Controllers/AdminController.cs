using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contracts.Admin;

namespace PickleTime.Api.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _adminService.GetDashboardStatsAsync();
            return Ok(stats);
        }

        /// <summary>
        /// Get all owners/managers (users with RoleId = 2)
        /// </summary>
        [HttpGet("owners/list")]
        public async Task<IActionResult> GetAllOwners()
        {
            try
            {
                var owners = await _adminService.GetAllOwnersAsync();
                return Ok(new { success = true, data = owners });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get all owner requests (users requesting to become owners)
        /// For now, return empty list - will implement with OwnerRequest table later
        /// </summary>
        [HttpGet("owner-requests/list")]
        public async Task<IActionResult> GetOwnerRequests()
        {
            try
            {
                // TODO: Implement when OwnerRequest table is available
                // For now, return empty array to prevent 404
                return Ok(new { 
                    success = true, 
                    data = new List<object>(),
                    message = "Owner requests feature coming soon" 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get all users (customers, owners, admins)
        /// </summary>
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _adminService.GetAllUsersAsync();
                return Ok(new { success = true, data = users });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get user by ID
        /// </summary>
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _adminService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }
                return Ok(new { success = true, data = user });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update user status (active/inactive)
        /// </summary>
        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] UpdateUserStatusDto dto)
        {
            try
            {
                var result = await _adminService.UpdateUserStatusAsync(id, dto.StatusId);
                if (!result)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }
                return Ok(new { success = true, message = "User status updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update user information
        /// </summary>
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                var result = await _adminService.UpdateUserAsync(id, dto);
                if (!result)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }
                return Ok(new { success = true, message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Soft delete user
        /// </summary>
        [HttpDelete("users/{id}/soft-delete")]
        public async Task<IActionResult> SoftDeleteUser(int id)
        {
            try
            {
                var result = await _adminService.SoftDeleteUserAsync(id);
                if (!result)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }
                return Ok(new { success = true, message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get all deleted users
        /// </summary>
        [HttpGet("users/deleted")]
        public async Task<IActionResult> GetDeletedUsers()
        {
            try
            {
                var users = await _adminService.GetDeletedUsersAsync();
                return Ok(new { success = true, data = users });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Restore deleted user
        /// </summary>
        [HttpPut("users/{id}/restore")]
        public async Task<IActionResult> RestoreUser(int id)
        {
            try
            {
                var result = await _adminService.RestoreUserAsync(id);
                if (!result)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }
                return Ok(new { success = true, message = "User restored successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}

