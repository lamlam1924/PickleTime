using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contracts.Images;
using PickleTime.Api.Application.Contracts.Images.Dtos;

namespace PickleTime.Api.Controllers;
[Route("api/[controller]")]
[ApiController]
public class FacilityImageController : ControllerBase
{
    private readonly IFacilityImageService _facilityImageService;

    public FacilityImageController(IFacilityImageService service)
    {
        _facilityImageService = service;
    }

    [HttpGet("{facilityId}")]
    public async Task<IActionResult> Get(int facilityId)
    {
        var images = await _facilityImageService.GetByFacilityIdAsync(facilityId);
        return Ok(images);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] FacilityImageUploadRequest request)
    {
        var image = await _facilityImageService.UploadAsync(request);
        return Ok(image);
    }

    [HttpDelete("{imageId}")]
    public async Task<IActionResult> Delete(int imageId)
    {
        var result = await _facilityImageService.DeleteAsync(imageId);
        if (!result) return NotFound();
        return NoContent();
    }
}