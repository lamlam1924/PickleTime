using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class CourtSurface
{
    public int SurfaceId { get; set; }

    public string SurfaceName { get; set; } = null!;

    public virtual ICollection<Court> Courts { get; set; } = new List<Court>();
}
