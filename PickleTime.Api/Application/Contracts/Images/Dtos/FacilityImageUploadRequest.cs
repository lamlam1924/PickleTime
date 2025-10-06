namespace PickleTime.Api.Application.Contracts.Images.Dtos;

public class FacilityImageUploadRequest
{
    public int FacilityId { get; set; }
    public string? Description { get; set; }
    public bool IsMainImage { get; set; }
    public int DisplayOrder { get; set; }
    public IFormFile File { get; set; } = null!;
}