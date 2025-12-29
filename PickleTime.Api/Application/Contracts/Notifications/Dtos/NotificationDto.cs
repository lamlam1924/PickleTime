namespace PickleTime.Api.Application.Contracts.Notifications.Dtos;

public class NotificationDto
{
    public long Id { get; set; }
    public int TypeId { get; set; }
    public string Title { get; set; } = null!;
    public string? Message { get; set; } = null!;
    public long? RequestId { get; set; }
    public bool Read { get; set; }
    public DateTime Timestamp { get; set; }
}