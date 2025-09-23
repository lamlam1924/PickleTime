using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class TimeSlotStatus
{
    public int TimeSlotStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();
}
