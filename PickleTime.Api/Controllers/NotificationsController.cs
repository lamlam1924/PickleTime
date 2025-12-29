using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contracts.Notifications;
using PickleTime.Api.Application.Contracts.Notifications.Dtos;
using PickleTime.Api.Common.Helpers;

namespace PickleTime.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    // GET /api/notifications → Lấy tất cả của user
    [HttpGet]
    public async Task<ActionResult<List<NotificationDto>>> GetMyNotifications()
    {
        var userId = JwtHelper.GetUserId(User);
        var notifications = await _notificationService.GetUserNotificationsAsync(userId);
        return Ok(notifications);
    }

    // POST /api/notifications/mark-read → Đánh dấu đã đọc
    [HttpPost("mark-read")]
    public async Task<IActionResult> MarkAsRead([FromBody] MarkAsReadDto dto)
    {
        var userId = JwtHelper.GetUserId(User);
        await _notificationService.MarkAsReadAsync(userId, dto.Ids);
        return Ok();
    }

    // DELETE /api/notifications → Xóa nhiều thông báo
    [HttpDelete]
    public async Task<IActionResult> DeleteNotifications([FromBody] DeleteNotificationsDto dto)
    {
        var userId = JwtHelper.GetUserId(User);
        await _notificationService.DeleteNotificationsAsync(userId, dto.Ids);
        return Ok();
    }

    // DELETE /api/notifications/{id} → Xóa 1 thông báo
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNotification(long id)
    {
        var userId = JwtHelper.GetUserId(User);
        await _notificationService.DeleteNotificationsAsync(userId, [id]);
        return Ok();
    }
}