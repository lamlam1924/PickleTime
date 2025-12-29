namespace PickleTime.Api.Application.Contracts.Facilities.Dtos;

public class AmenityDto
{
    public int AmenityId { get; set; }
    public string AmenityCode { get; set; } = null!;
    public string AmenityName { get; set; } = null!;
    public string? Description { get; set; }
}
