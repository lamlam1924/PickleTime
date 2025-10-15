namespace PickleTime.Api.Application.Contracts.Facilities.Dtos;

public class FacilityOperatingHourDto
{
    public byte DayOfWeek { get; set; }
    public TimeOnly OpenTime { get; set; }
    public TimeOnly CloseTime { get; set; }
    public bool IsClosed { get; set; }
}
