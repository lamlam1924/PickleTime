namespace PickleTime.Api.Application.Contracts.Courts.Dtos;

public class CourtDetailDto
{
    public int CourtId { get; set; }
    public string CourtName { get; set; } = null!;
    public string TypeName { get; set; } = null!;
    public string SurfaceName { get; set; } = null!;
    public bool IsIndoor { get; set; }
    public bool HasLighting { get; set; }
    public string StatusName { get; set; } = null!;
    public string? Description { get; set; }
    public string? CourtImageUrl { get; set; }
}
