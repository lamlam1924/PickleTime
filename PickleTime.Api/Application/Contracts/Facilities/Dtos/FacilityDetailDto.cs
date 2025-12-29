using PickleTime.Api.Application.Contracts.Courts.Dtos;
using PickleTime.Api.Application.Contracts.Reviews.Dtos;

namespace PickleTime.Api.Application.Contracts.Facilities.Dtos;

public class FacilityDetailDto
{
    public int FacilityId { get; set; }
    public string FacilityName { get; set; } = null!;
    public string Address { get; set; } = null!;
    public string Province { get; set; } = null!;
    public string District { get; set; } = null!;
    public string Ward { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Description { get; set; }
    public IEnumerable<AmenityDto> Amenities { get; set; } = new List<AmenityDto>();
    public decimal? Rating { get; set; }
    public int? TotalRatings { get; set; }
    public string StatusName { get; set; } = null!;
    public TimeOnly OpenTime { get; set; }
    public TimeOnly CloseTime { get; set; }

    public IEnumerable<FacilityImageDto> FacilityImages { get; set; } = new List<FacilityImageDto>();
    public IEnumerable<CourtDto> Courts { get; set; } = new List<CourtDto>();
    public IEnumerable<FacilityOperatingHourDto> OperatingHours { get; set; } = new List<FacilityOperatingHourDto>();
    
    public List<ReviewDto> Reviews { get; set; } = new();
    public double AverageRating { get; set; }
}

