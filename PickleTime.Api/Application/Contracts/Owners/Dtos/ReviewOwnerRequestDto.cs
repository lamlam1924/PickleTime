namespace PickleTime.Api.Application.Contracts.Owners.Dtos;

public class ReviewOwnerRequestDto
{
    public int StatusId { get; set; }      // 2 = Approved, 3 = Rejected
    public int ReviewedBy { get; set; }    // Admin ID
}