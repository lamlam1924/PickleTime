namespace PickleTime.Api.Application.Contracts.Owners.Dtos;

public class CreateOwnerRequestDto
{
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public int CreatedUserId { get; set; }
}