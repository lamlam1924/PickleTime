using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using PickleTime.Api.Application.Contracts.Notifications;
using PickleTime.Api.Application.Contracts.Notifications.Dtos;
using PickleTime.Api.Domain.Entities;
using PickleTime.Api.Hubs;

namespace PickleTime.Api.Application.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly IMapper _mapper;

    public NotificationService
    (INotificationRepository repo, IHubContext<NotificationHub> hubContext,
        IMapper mapper)
    {
        _notificationRepository = repo;
        _hubContext = hubContext;
        _mapper = mapper;
    }

    public async Task SendNotificationAsync(
        int userId, int typeId, string title, string message, long? requestId = null)
    {
        // 1. Tạo Notification
        var notification = new Notification
        {
            TypeId = typeId,
            Title = title,
            Message = message,
            RequestId = requestId,
            CreatedAt = DateTime.UtcNow
        };

        var notificationId = await _notificationRepository.AddNotificationAsync(notification);

        // 2. Tạo Status (chưa đọc)
        var status = new NotificationStatus
        {
            NotificationId = notificationId,
            UserId = userId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _notificationRepository.AddStatusAsync(status);
        await _notificationRepository.SaveChangesAsync();

        // 3. Gửi SignalR
        var payload = new
        {
            id = notificationId,
            typeId,
            title,
            message,
            requestId,
            read = false,
            timestamp = DateTime.UtcNow
        };

        await _hubContext.Clients
            .Group($"user-{userId}")
            .SendAsync("ReceiveNotification", payload);
    }
    public async Task<List<NotificationDto>> GetUserNotificationsAsync(int userId)
    {
        var data = await _notificationRepository.GetUserNotificationsAsync(userId);

        return data.Select(x => new NotificationDto
        {
            Id = x.Notification.Id,
            TypeId = x.Notification.TypeId,
            Title = x.Notification.Title,
            Message = x.Notification.Message,
            RequestId = x.Notification.RequestId,
            Read = x.IsRead,
            Timestamp = x.Notification.CreatedAt
        }).ToList();
    }

    public async Task MarkAsReadAsync(int userId, List<long> notificationIds)
    {
        await _notificationRepository.MarkAsReadAsync(userId, notificationIds);
    }

    public async Task DeleteNotificationsAsync(int userId, List<long> notificationIds)
    {
        await _notificationRepository.DeleteNotificationsAsync(userId, notificationIds);
    }
}