namespace PickleTime.Api.Application.Contract.Auth.Dto
{
    public class LoginRequestDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Portal { get; set; } = "user"; // "user" | "admin" | "owner"
    }
}