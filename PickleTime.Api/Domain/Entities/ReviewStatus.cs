using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class ReviewStatus
{
    public int ReviewStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
