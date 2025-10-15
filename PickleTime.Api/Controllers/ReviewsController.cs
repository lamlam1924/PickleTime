using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contracts.Reviews;

namespace PickleTime.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("{facilityId}")]
    public async Task<IActionResult> GetFacilityReviews(int facilityId)
    {
        try
        {
            var result = await _reviewService.GetReviewsByFacilityIdAsync(facilityId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi server khi lấy đánh giá: " + ex.Message });
        }
    }
}