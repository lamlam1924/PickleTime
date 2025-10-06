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

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string keyword)
    {
        var facilities = await _facilityService.SearchFacilitiesAsync(keyword);
        return Ok(facilities);
    }
    
    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<FacilityDto>>> GetAll()
    {
        var facilities = await _facilityService.GetAllAsync();
        return Ok(facilities);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FacilityDto>> GetById(int id)
    {
        var facility = await _facilityService.GetByIdAsync(id);
        if (facility == null)
            return NotFound();

        return Ok(facility);
    }
}