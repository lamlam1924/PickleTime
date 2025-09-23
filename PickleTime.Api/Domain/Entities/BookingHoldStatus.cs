using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class BookingHoldStatus
{
    public int BookingHoldStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<BookingHold> BookingHolds { get; set; } = new List<BookingHold>();
}
