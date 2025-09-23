using System;
using System.Collections.Generic;

namespace PickleTime.Api.Domain.Entities;

public partial class CourtMaintenance
{
    public int MaintenanceId { get; set; }

    public int CourtId { get; set; }

    public DateTime StartDateTime { get; set; }

    public DateTime EndDateTime { get; set; }

    public string? Reason { get; set; }

    public virtual Court Court { get; set; } = null!;
}
