namespace PickleTime.Api.Application.Contracts.OwnerProfile.Dtos
{
    public class UpdateOwnerProfileDto
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
    }
}
