namespace PickleTime.Api.Application.Contracts.Facilities.Dtos;

public class FacilityDto
{
    public int FacilityId { get; set; }
    public string FacilityName { get; set; }
    public string Address { get; set; }
    public string OpenTime { get; set; }
    public string CloseTime { get; set; }
    public List<string> SportTypes { get; set; }
    
    // Danh sách URL ảnh
    public List<string> ImageUrls { get; set; } = new();

    // Ảnh đại diện (main image) = ảnh đầu tiên
    public string? MainImageUrl { get; set; }
}