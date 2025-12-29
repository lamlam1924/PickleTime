namespace PickleTime.Api.Application.Contracts.Notifications.Dtos;

public class MarkAsReadDto
{
    public List<long> Ids { get; set; } = new();
}