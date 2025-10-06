namespace PickleTime.Api.Application.Contracts.Images.Dtos;

public class CourtImageDto
{
    public int Id { get; set; }
    public int CourtId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty; 
    public bool IsMainImage { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
}