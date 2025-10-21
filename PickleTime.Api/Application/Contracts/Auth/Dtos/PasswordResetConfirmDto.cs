using System.ComponentModel.DataAnnotations;

namespace PickleTime.Api.Application.Contracts.Auth.Dtos;

public class PasswordResetConfirmDto
{
    [Required]
    public string Token { get; set; } = null!;

    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
    public string NewPassword { get; set; } = null!;

    [Required]
    [Compare(nameof(NewPassword), ErrorMessage = "Password confirmation does not match")]
    public string ConfirmPassword { get; set; } = null!;
}

