//(Response DTO)
namespace PickleTime.Api.Application.Contracts.Owners.Dtos;

public class OwnerRequestDto
{
    public int RequestId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;

    public string StatusName { get; set; } = null!;
    public DateTime SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewedByName { get; set; }
    public string? AdminNote { get; set; }
}