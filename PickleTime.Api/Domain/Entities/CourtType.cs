using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class CourtType
{
    public int TypeId { get; set; }

    public string TypeName { get; set; } = null!;

    public virtual ICollection<Court> Courts { get; set; } = new List<Court>();
}
