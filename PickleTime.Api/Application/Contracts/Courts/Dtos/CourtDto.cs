using PickleTime.Api.Application.Contracts.Images.Dtos;

namespace PickleTime.Api.Application.Contracts.Courts.Dtos;

public class CourtDto
{
    public int CourtId { get; set; }
    public string CourtName { get; set; } = null!;
    public string TypeName { get; set; } = null!;
    public string SurfaceName { get; set; } = null!;
    public string StatusName { get; set; } = null!;
    public bool IsIndoor { get; set; }
    public bool HasLighting { get; set; }
    public string? Description { get; set; }

    public CourtImageDto? CourtImage { get; set; }
}
