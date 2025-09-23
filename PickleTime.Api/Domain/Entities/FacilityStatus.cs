using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class FacilityStatus
{
    public int StatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Facility> Facilities { get; set; } = new List<Facility>();
}
