namespace PickleTime.Api.Application.Contract.Auth.Dto
{
    public class RegisterResponseDto
    {
        public string Token { get; set; } = null!;
        public string Message { get; set; } = null!;
        public bool Success { get; set; }
    }
}

