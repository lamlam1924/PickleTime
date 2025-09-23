using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class FacilityOperatingHour
{
    public int FacilityId { get; set; }

    public byte DayOfWeek { get; set; }

    public TimeOnly OpenTime { get; set; }

    public TimeOnly CloseTime { get; set; }

    public bool IsClosed { get; set; }

    public virtual Facility Facility { get; set; } = null!;
}
