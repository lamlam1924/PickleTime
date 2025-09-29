using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PickleTime.Api.Controllers;

public class Base: ControllerBase
{
    [Authorize] // cần đăng nhập
    [HttpGet("profile")]
    public IActionResult Profile() => Ok("This is your profile");

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public IActionResult AdminDashboard() => Ok("Admin only area");

    [Authorize(Roles = "Manager,Admin")]
    [HttpGet("manage")]
    public IActionResult ManageArea() => Ok("Manager or Admin can access");

}