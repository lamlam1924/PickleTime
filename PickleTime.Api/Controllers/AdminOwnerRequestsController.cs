using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contracts.Owners;
using PickleTime.Api.Application.Contracts.Owners.Dtos;
using PickleTime.Api.Common.Helpers;

namespace PickleTime.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminOwnerRequestsController : ControllerBase
{
    private readonly IOwnerRequestService _service;

    public AdminOwnerRequestsController(IOwnerRequestService service)
    {
        _service = service;
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllRequestsAsync();
        return Ok(result);
    }

    [HttpPut("{id}/review")]
    public async Task<IActionResult> Review(int id, [FromBody] ReviewOwnerRequestDto dto)
    {
        var result = await _service.ReviewRequestAsync(id, dto);
        return Ok(result);
    }

    [HttpPut("{id}/accept")]
    public async Task<IActionResult> Accept(int id)
    {
        var adminId = JwtHelper.GetUserId(User);
        var result = await _service.AcceptRequestAsync(id, adminId);
        return Ok(result);
    }

    [HttpPut("{id}/reject")]
    public async Task<IActionResult> Reject(int id)
    {
        var adminId = JwtHelper.GetUserId(User);
        var result = await _service.RejectRequestAsync(id, adminId);
        return Ok(result);
    }

    [HttpPut("{id}/reconsider")]
    public async Task<IActionResult> Reconsider(int id)
    {
        var adminId = JwtHelper.GetUserId(User);
        var result = await _service.ReconsiderRequestAsync(id, adminId);
        return Ok(result);
    }
}