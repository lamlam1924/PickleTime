using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contracts.Owners;
using PickleTime.Api.Application.Contracts.Owners.Dtos;
using PickleTime.Api.Common.Helpers;

namespace PickleTime.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "customer")]
public class OwnerRequestsController : ControllerBase
{
    private readonly IOwnerRequestService _service;

    public OwnerRequestsController(IOwnerRequestService service)
    {
        _service = service;
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateOwnerRequestDto dto)
    {
        try
        {
            var userId = JwtHelper.GetUserId(User);
            dto.CreatedUserId = userId;
            var result = await _service.CreateRequestAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyRequests()
    {
        var userId = JwtHelper.GetUserId(User); // LẤY TỪ TOKEN
        var result = await _service.GetRequestsByUserAsync(userId);
        return Ok(result);
    }
}