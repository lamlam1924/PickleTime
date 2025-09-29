namespace PickleTime.Api.Application.Contract.Auth.Dto
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = null!;
        public string Message { get; set; } = null!;
    }
}