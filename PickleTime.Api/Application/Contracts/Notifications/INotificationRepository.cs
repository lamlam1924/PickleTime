using PickleTime.Api.Domain.Entities;

namespace PickleTime.Api.Application.Contracts.Notifications;

public interface INotificationRepository
{
    Task<long> AddNotificationAsync(Notification notification);
    Task AddStatusAsync(NotificationStatus status);
    Task SaveChangesAsync();
    Task<List<(Notification Notification, bool IsRead)>> GetUserNotificationsAsync(int userId);
    Task MarkAsReadAsync(int userId, List<long> notificationIds);
    Task DeleteNotificationsAsync(int userId, List<long> notificationIds);
}