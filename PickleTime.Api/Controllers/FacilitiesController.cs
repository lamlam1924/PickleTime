using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contracts.Facilities;
using PickleTime.Api.Application.Contracts.Facilities.Dtos;

namespace PickleTime.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FacilitiesController : ControllerBase
{
    private readonly IFacilityService _facilityService;

    public FacilitiesController(IFacilityService service) => _facilityService = service;

    // Tìm kiếm Facility theo từ khóa
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string keyword)
    {
        var facilities = await _facilityService.SearchFacilitiesAsync(keyword);
        return Ok(facilities);
    }

    // Tìm kiếm nâng cao với filter và sort
    [HttpPost("advanced-search")]
    public async Task<ActionResult<FacilitySearchResultDto>> AdvancedSearch([FromBody] FacilitySearchFilterDto filter)
    {
        var result = await _facilityService.AdvancedSearchAsync(filter);
        return Ok(result);
    }
    
    // Lấy tất cả Facility đang hoạt động
    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<FacilityDto>>> GetAll()
    {
        var facilities = await _facilityService.GetAllAsync();
        return Ok(facilities);
    }

    // Lấy thông tin Facility theo ID
    [HttpGet("{id}")]
    public async Task<ActionResult<FacilityDto>> GetById(int id)
    {
        var facility = await _facilityService.GetByIdAsync(id);
        if (facility == null)
            return NotFound();

        return Ok(facility);
    }

    // Lấy chi tiết Facility (bao gồm hình ảnh và sân)
    [HttpGet("detail/{id}")]
    public async Task<ActionResult<FacilityDetailDto>> GetFacilityById(int id)
    {
        var facility = await _facilityService.GetFacilityByIdAsync(id);
        if (facility == null)
            return NotFound(new { message = "Facility not found" });

        return Ok(facility);
    }
}