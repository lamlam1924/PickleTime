using PickleTime.Api.Application.Contracts.Notifications.Dtos;

namespace PickleTime.Api.Application.Contracts.Notifications;

public interface INotificationService
{
    Task SendNotificationAsync(int userId, int typeId, string title, string message, long? requestId = null);
    Task<List<NotificationDto>> GetUserNotificationsAsync(int userId);
    Task MarkAsReadAsync(int userId, List<long> notificationIds);
    Task DeleteNotificationsAsync(int userId, List<long> notificationIds);
}