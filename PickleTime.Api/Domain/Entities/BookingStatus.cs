using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class BookingStatus
{
    public int BookingStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
