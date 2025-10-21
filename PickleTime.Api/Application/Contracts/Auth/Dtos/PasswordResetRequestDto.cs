using System.ComponentModel.DataAnnotations;

namespace PickleTime.Api.Application.Contracts.Auth.Dtos;

public class PasswordResetRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
}

