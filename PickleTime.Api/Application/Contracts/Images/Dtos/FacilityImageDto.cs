namespace PickleTime.Api.Application.Contracts.Images.Dtos;

public class FacilityImageDto
{
    public int Id { get; set; }
    public int FacilityId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty; 
    public bool IsMainImage { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
}