using Microsoft.AspNetCore.SignalR;

namespace PickleTime.Api.Hubs;

public class NotificationHub : Hub
{
    // Join group theo userId để gửi notification riêng lẻ
    public async Task JoinUserGroup(int userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
    }

    public async Task LeaveUserGroup(int userId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user-{userId}");
    }

    public async Task SendNotification(string roomName, string message)
    {
        await Clients.Group(roomName).SendAsync("ReceiveNotification", message);
    }
}