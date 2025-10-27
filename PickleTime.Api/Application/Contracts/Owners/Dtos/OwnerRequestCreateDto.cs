namespace PickleTime.Api.Application.Contracts.Owners.Dtos;

public class OwnerRequestCreateDto
{
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
}