namespace PickleTime.Api.Application.Contract.Auth.Dto
{
    public class LoginRequestDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}