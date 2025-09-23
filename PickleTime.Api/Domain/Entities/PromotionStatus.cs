using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class PromotionStatus
{
    public int PromotionStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Promotion> Promotions { get; set; } = new List<Promotion>();
}
