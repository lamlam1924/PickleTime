namespace PickleTime.Api.Application.Contracts.Auth.Dtos;

public class ChangePasswordDto
{
    public string CurrentPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
    public string ConfirmNewPassword { get; set; } = null!;
}

public class ChangePasswordResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
}