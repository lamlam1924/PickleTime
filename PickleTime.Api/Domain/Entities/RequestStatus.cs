using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class RequestStatus
{
    public int StatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<OwnerRequest> OwnerRequests { get; set; } = new List<OwnerRequest>();
}
