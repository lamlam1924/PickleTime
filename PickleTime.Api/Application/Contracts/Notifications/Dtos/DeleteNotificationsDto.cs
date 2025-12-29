namespace PickleTime.Api.Application.Contracts.Notifications.Dtos;

public class DeleteNotificationsDto
{
    public List<long> Ids { get; set; } = new();
}