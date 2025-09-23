using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class TimeSlot
{
    public int TimeSlotId { get; set; }

    public int CourtId { get; set; }

    public DateOnly SlotDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public int TimeSlotStatusId { get; set; }

    public decimal Price { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Court Court { get; set; } = null!;

    public virtual TimeSlotStatus TimeSlotStatus { get; set; } = null!;
}
