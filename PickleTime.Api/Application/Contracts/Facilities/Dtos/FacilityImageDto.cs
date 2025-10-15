using PickleTime.Api.Application.Contracts.Images.Dtos;

namespace PickleTime.Api.Application.Contracts.Facilities.Dtos;

public class FacilityImageDto
{
    public int ImageId { get; set; }
    public string ImageUrl { get; set; } = null!;
    public bool IsMainImage { get; set; }
    public int DisplayOrder { get; set; }
    public string? Description { get; set; }
    public string? PublicId { get; set; }
    public CourtImageDto? CourtImage { get; set; }
}

