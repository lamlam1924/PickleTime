namespace PickleTime.Api.Application.Contracts.Facilities.Dtos;

public class FacilitySearchFilterDto
{
    public string? SearchTerm { get; set; }
    public string? Province { get; set; }
    public string? District { get; set; }
    public decimal MinRating { get; set; } = 0;
    public bool? IsIndoor { get; set; }
    public bool? HasLighting { get; set; }
    public List<string> CourtTypes { get; set; } = new();
    public string SortBy { get; set; } = "relevance"; // relevance, rating, name, newest
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class FacilitySearchResultDto
{
    public List<FacilityDto> Facilities { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
