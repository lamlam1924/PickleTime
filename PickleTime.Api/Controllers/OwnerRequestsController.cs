using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contracts.Owners;
using PickleTime.Api.Application.Contracts.Owners.Dtos;

namespace PickleTime.Api.Controllers;

[ApiController]
[Route("api/admin/[controller]")]
public class OwnerRequestsController : ControllerBase
{
    private readonly IOwnerRequestService _service;

    public OwnerRequestsController(IOwnerRequestService service)
    {
        _service = service;
    }

    // [PORT 1] User gửi yêu cầu trở thành Owner
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOwnerRequestDto dto)
    {
        var result = await _service.CreateRequestAsync(dto);
        return Ok(result);
    }

    // [PORT 1] User xem các yêu cầu đã gửi
    [HttpGet("my")]
    public async Task<IActionResult> GetMyRequests([FromQuery] int userId)
    {
        var result = await _service.GetRequestsByUserAsync(userId);
        return Ok(result);
    }

    // [PORT 2] Admin xem danh sách yêu cầu
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllRequestsAsync();
        return Ok(result);
    }

    // [PORT 2] Admin duyệt / từ chối yêu cầu
    [HttpPut("{id}/review")]
    public async Task<IActionResult> Review(int id, [FromBody] ReviewOwnerRequestDto dto)
    {
        var result = await _service.ReviewRequestAsync(id, dto);
        return Ok(result);
    }
}
