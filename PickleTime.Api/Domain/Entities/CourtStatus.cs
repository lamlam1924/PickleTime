using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class CourtStatus
{
    public int StatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Court> Courts { get; set; } = new List<Court>();
}
