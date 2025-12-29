using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.Notifications;
using PickleTime.Api.Domain.Entities;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Infrastructure.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly PickleTimeDbContext _context;

    public NotificationRepository(PickleTimeDbContext context)
    {
        _context = context;
    }

    public async Task<long> AddNotificationAsync(Notification notification)
    {
        _context.Notifications.Add(notification);
        await SaveChangesAsync();
        return notification.Id;
    }

    public async Task AddStatusAsync(NotificationStatus status)
    {
        _context.NotificationStatuses.Add(status);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<List<(Notification Notification, bool IsRead)>> GetUserNotificationsAsync(int userId)
    {
        return await _context.NotificationStatuses
            .Where(ns => ns.UserId == userId && !ns.IsDeleted)
            .OrderByDescending(ns => ns.Notification.CreatedAt)
            .Select(ns => new
            {
                ns.Notification,
                ns.IsRead
            })
            .ToListAsync()
            .ContinueWith(t => t.Result
                .Select(x => (x.Notification, x.IsRead))
                .ToList());
    }

    public async Task MarkAsReadAsync(int userId, List<long> notificationIds)
    {
        var statuses = await _context.NotificationStatuses
            .Where(ns => ns.UserId == userId && notificationIds.Contains(ns.NotificationId))
            .ToListAsync();

        foreach (var status in statuses)
        {
            status.IsRead = true;
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteNotificationsAsync(int userId, List<long> notificationIds)
    {
        // 1. XÓA MỀM STATUS
        await SoftDeleteStatuses(userId, notificationIds);

        // 2. XÓA MỀM NOTIFICATION NẾU KHÔNG CÒN USER
        await SoftDeleteOrphanNotifications(notificationIds);

        await SaveChangesAsync();
    }

    private async Task SoftDeleteStatuses(int userId, List<long> notificationIds)
    {
        var statuses = await _context.NotificationStatuses
            .Where(ns => ns.UserId == userId
                         && notificationIds.Contains(ns.NotificationId)
                         && !ns.IsDeleted)
            .ToListAsync();

        foreach (var status in statuses)
        {
            status.IsDeleted = true;
        }
    }

    private async Task SoftDeleteOrphanNotifications(List<long> notificationIds)
    {
        // 1. Lấy các NotificationId còn ít nhất 1 status chưa xóa
        var activeNotificationIds = await _context.NotificationStatuses
            .Where(ns => notificationIds.Contains(ns.NotificationId) && !ns.IsDeleted)
            .Select(ns => ns.NotificationId)
            .Distinct()
            .ToListAsync();

        // 2. Tìm các Id KHÔNG còn ai theo dõi
        var orphanIds = notificationIds.Except(activeNotificationIds).ToList();
        if (!orphanIds.Any()) return;

        // 3. Xóa mềm các Notification đó
        var notifications = await _context.Notifications
            .Where(n => orphanIds.Contains(n.Id))
            .ToListAsync();

        foreach (var notif in notifications)
        {
            notif.IsDeleted = true;
        }
    }
}