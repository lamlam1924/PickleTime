using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contracts.Files;
using PickleTime.Api.Application.Contracts.Images;
using PickleTime.Api.Application.Contracts.Images.Dtos;
using PickleTime.Api.Application.Services;

namespace PickleTime.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CourtImageController : ControllerBase
{
    private readonly ICourtImageService _courtImageService;

    public CourtImageController(ICourtImageService service)
    {
        _courtImageService = service;
    }

    [HttpGet("{courtId}")]
    public async Task<IActionResult> Get(int courtId)
    {
        var images = await _courtImageService.GetByCourtIdAsync(courtId);
        return Ok(images);
    }

    // [Authorize (Roles = "Admin,Manager,Customer")]
    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] CourtImageUploadRequest request)
    {
        var image = await _courtImageService.UploadAsync(request);
        return Ok(image);
    }

    [HttpDelete("{imageId}")]
    public async Task<IActionResult> Delete(int imageId)
    {
        var result = await _courtImageService.DeleteAsync(imageId);
        if (!result) return NotFound();
        return NoContent();
    }
}