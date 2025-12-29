using Microsoft.EntityFrameworkCore;
using PickleTime.Api.Application.Contracts.Bookings;
using PickleTime.Api.Application.Contracts.Bookings.Dtos;
using PickleTime.Api.Domain.Entities;
using PickleTime.Api.Infrastructure.Data;

namespace PickleTime.Api.Application.Services;

public class BookingService : IBookingService
{
    private readonly PickleTimeDbContext _context;

    public BookingService(PickleTimeDbContext context)
    {
        _context = context;
    }

    public async Task<AvailabilitySlotsResponseDto> GetAvailableTimeSlotsAsync(int facilityId, DateOnly date, int? courtId = null)
    {
        // Get enhanced availability with dynamic slots
        var enhanced = await GetEnhancedAvailabilityAsync(facilityId, date, courtId);
        
        // Convert to simple format for backward compatibility
        return new AvailabilitySlotsResponseDto
        {
            FacilityId = facilityId,
            Date = date,
            Slots = enhanced.Slots.Select(s => new TimeSlotDto
            {
                TimeSlotId = 0, // No pre-existing ID for dynamic slots
                CourtId = s.CourtId,
                CourtName = s.CourtName,
                IsIndoor = s.IsIndoor,
                HasLighting = s.HasLighting,
                CourtType = s.CourtType,
                SurfaceName = s.SurfaceName,
                SlotDate = s.SlotDate,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                Price = s.FinalPrice,
                Status = s.IsAvailable ? "Available" : "Booked",
                TimeSlotStatusId = s.IsAvailable ? 1 : 2
            }).ToList(),
            TotalSlots = enhanced.TotalSlots
        };
    }
    
    /// <summary>
    /// Generate dynamic time slots from FacilityOperatingHours
    /// </summary>
    public async Task<EnhancedAvailabilityResponseDto> GetEnhancedAvailabilityAsync(int facilityId, DateOnly date, int? courtId = null)
    {
        // Get facility with operating hours
        var facility = await _context.Facilities
            .Include(f => f.FacilityOperatingHours)
            .FirstOrDefaultAsync(f => f.FacilityId == facilityId);
            
        if (facility == null)
            throw new InvalidOperationException("Facility not found");
            
        // Get operating hours for this day of week
        var dayOfWeek = (byte)((int)date.ToDateTime(TimeOnly.MinValue).DayOfWeek == 0 ? 7 : (int)date.ToDateTime(TimeOnly.MinValue).DayOfWeek);
        var operatingHour = facility.FacilityOperatingHours.FirstOrDefault(oh => oh.DayOfWeek == dayOfWeek);
        
        TimeOnly openTime, closeTime;
        bool isOvernightOperation = false;
        
        if (operatingHour != null && !operatingHour.IsClosed)
        {
            openTime = operatingHour.OpenTime;
            closeTime = operatingHour.CloseTime;
            isOvernightOperation = closeTime < openTime; // e.g., 20:00 to 04:00
        }
        else
        {
            // Use default facility hours
            openTime = facility.OpenTime;
            closeTime = facility.CloseTime;
            isOvernightOperation = closeTime < openTime;
        }
        
        // Get booking rules - Smart limits to ensure fairness
        var rules = new BookingRulesDto
        {
            MinimumDurationHours = 1,
            SlotIntervalMinutes = 60, // 1 hour slots
            MaxConsecutiveSlots = 3, // Max 3 hours per booking to leave slots for others
            MaxSlotsPerUserPerDay = 4, // Max 4 hours total per day
            MaxBookingsPerUserPerWeek = 10, // Max 10 bookings per week
            MinimumBufferMinutes = 0,
            MaxAdvanceBookingDays = 7, // Regular users: 1 week ahead only
            MinAdvanceBookingHours = 2, // Must book 2 hours before
            AllowRecurringBookings = false, // Only for premium users
            BookingHoldMinutes = 15, // 15 min to complete payment
            
            // Premium user gets higher limits
            IsPremiumUser = false, // TODO: Check from user profile
            PremiumMaxConsecutiveSlots = 5, // Premium: max 5 hours
            PremiumMaxAdvanceBookingDays = 30 // Premium: 1 month ahead
        };
        
        // Get active courts with related data
        var courtsQuery = _context.Courts
            .Include(c => c.Type)
            .Include(c => c.Surface)
            .Include(c => c.Status)
            .Where(c => c.FacilityId == facilityId && c.StatusId == 1);
        if (courtId.HasValue)
            courtsQuery = courtsQuery.Where(c => c.CourtId == courtId.Value);
        var courts = await courtsQuery.ToListAsync();
        
        // Get existing bookings for this date
        var courtIds = courts.Select(c => c.CourtId).ToList();
        var existingBookings = await _context.BookingDetails
            .Include(bd => bd.Booking)
            .Where(bd => courtIds.Contains(bd.CourtId) && 
                        bd.SlotDate == date &&
                        bd.Booking.BookingStatusId != 3) // Exclude cancelled
            .ToListAsync();
        
        // Generate dynamic slots
        var dynamicSlots = new List<DynamicSlotDto>();
        var dayType = (date.ToDateTime(TimeOnly.MinValue).DayOfWeek == DayOfWeek.Saturday || 
                      date.ToDateTime(TimeOnly.MinValue).DayOfWeek == DayOfWeek.Sunday) ? "Weekend" : "Weekday";
        
        foreach (var court in courts)
        {
            var currentTime = openTime;
            var endOfDay = isOvernightOperation ? closeTime.AddHours(24) : closeTime;
            
            while (currentTime < endOfDay)
            {
                var slotEndTime = currentTime.AddMinutes(rules.SlotIntervalMinutes);
                if (slotEndTime > endOfDay) break;
                
                // Check if this slot is already booked
                var isBooked = existingBookings.Any(b => 
                    b.CourtId == court.CourtId &&
                    b.StartTime < slotEndTime &&
                    b.EndTime > currentTime);
                
                // Get pricing for this time slot
                var pricing = await GetSlotPricingAsync(court.CourtId, date, currentTime, dayType);
                
                var slot = new DynamicSlotDto
                {
                    CourtId = court.CourtId,
                    CourtName = court.CourtName,
                    IsIndoor = court.IsIndoor,
                    HasLighting = court.HasLighting,
                    CourtType = court.Type?.TypeName,
                    SurfaceName = court.Surface?.SurfaceName,
                    Description = court.Description,
                    SlotDate = date,
                    StartTime = currentTime,
                    EndTime = slotEndTime,
                    BasePrice = pricing.BasePrice,
                    CurrentPrice = pricing.CurrentPrice,
                    TimePeriod = GetTimePeriod(currentTime),
                    DayType = dayType,
                    IsPeakTime = pricing.IsPeakTime,
                    DiscountPercent = pricing.DiscountPercent,
                    DiscountReason = pricing.DiscountReason,
                    FinalPrice = pricing.FinalPrice,
                    IsAvailable = !isBooked,
                    UnavailableReason = isBooked ? "Already booked" : null
                };
                
                dynamicSlots.Add(slot);
                currentTime = slotEndTime;
            }
        }
        
        // Calculate price ranges
        var priceRanges = CalculatePriceRanges(dynamicSlots);
        
        // Get available discounts
        var discounts = GetAvailableDiscounts();
        
        return new EnhancedAvailabilityResponseDto
        {
            FacilityId = facilityId,
            Date = date,
            OpenTime = openTime,
            CloseTime = closeTime,
            IsOvernightOperation = isOvernightOperation,
            Slots = dynamicSlots.OrderBy(s => s.CourtId).ThenBy(s => s.StartTime).ToList(),
            Rules = rules,
            PriceRanges = priceRanges,
            AvailableDiscounts = discounts,
            TotalSlots = dynamicSlots.Count,
            AvailableSlots = dynamicSlots.Count(s => s.IsAvailable),
            BookedSlots = dynamicSlots.Count(s => !s.IsAvailable)
        };
    }
    
    private async Task<(decimal BasePrice, decimal CurrentPrice, bool IsPeakTime, decimal DiscountPercent, string? DiscountReason, decimal FinalPrice)> 
        GetSlotPricingAsync(int courtId, DateOnly date, TimeOnly startTime, string dayType)
    {
        // Get applicable pricing rule
        var pricingRule = await _context.PricingRules
            .Where(pr => pr.CourtId == courtId &&
                        pr.DayType == dayType &&
                        pr.IsActive &&
                        pr.EffectiveFrom <= date &&
                        (pr.EffectiveTo == null || pr.EffectiveTo >= date) &&
                        pr.TimeSlotStart <= startTime &&
                        pr.TimeSlotEnd > startTime)
            .OrderByDescending(pr => pr.EffectiveFrom)
            .FirstOrDefaultAsync();
        
        decimal basePrice = pricingRule?.PricePerHour ?? 100000; // Default price
        decimal currentPrice = basePrice;
        bool isPeakTime = false;
        decimal discountPercent = 0;
        string? discountReason = null;
        
        // Determine if peak time (6 PM - 9 PM weekdays, all day weekend)
        if (dayType == "Weekend")
        {
            isPeakTime = true;
        }
        else if (startTime >= new TimeOnly(18, 0) && startTime < new TimeOnly(21, 0))
        {
            isPeakTime = true;
        }
        
        // Apply off-peak discount (10% for off-peak hours)
        if (!isPeakTime && dayType == "Weekday")
        {
            discountPercent = 10;
            discountReason = "Off-peak hours discount";
        }
        
        decimal finalPrice = currentPrice * (1 - discountPercent / 100);
        
        return (basePrice, currentPrice, isPeakTime, discountPercent, discountReason, finalPrice);
    }
    
    private string GetTimePeriod(TimeOnly time)
    {
        if (time >= new TimeOnly(6, 0) && time < new TimeOnly(12, 0))
            return "Morning";
        if (time >= new TimeOnly(12, 0) && time < new TimeOnly(18, 0))
            return "Afternoon";
        if (time >= new TimeOnly(18, 0) && time < new TimeOnly(22, 0))
            return "Evening";
        return "Night";
    }
    
    private Dictionary<string, PriceRangeDto> CalculatePriceRanges(List<DynamicSlotDto> slots)
    {
        var ranges = new Dictionary<string, PriceRangeDto>();
        
        foreach (var period in new[] { "Morning", "Afternoon", "Evening", "Night" })
        {
            var periodSlots = slots.Where(s => s.TimePeriod == period).ToList();
            if (periodSlots.Any())
            {
                ranges[period] = new PriceRangeDto
                {
                    Period = period,
                    StartTime = periodSlots.Min(s => s.StartTime),
                    EndTime = periodSlots.Max(s => s.EndTime),
                    MinPrice = periodSlots.Min(s => s.FinalPrice),
                    MaxPrice = periodSlots.Max(s => s.FinalPrice),
                    IsPeakTime = periodSlots.Any(s => s.IsPeakTime)
                };
            }
        }
        
        return ranges;
    }
    
    private List<DiscountInfoDto> GetAvailableDiscounts()
    {
        return new List<DiscountInfoDto>
        {
            new DiscountInfoDto
            {
                Name = "Off-Peak Discount",
                Description = "10% off for weekday morning and afternoon slots",
                DiscountPercent = 10,
                ApplicableFor = "Off-peak hours",
                Conditions = new List<string> { "Weekday mornings (6 AM - 12 PM)", "Weekday afternoons (12 PM - 6 PM)" }
            },
            new DiscountInfoDto
            {
                Name = "Bulk Booking",
                Description = "Book 10+ sessions and get 15% off",
                DiscountPercent = 15,
                ApplicableFor = "Bulk booking",
                Conditions = new List<string> { "Minimum 10 bookings", "Valid for recurring bookings" }
            },
            new DiscountInfoDto
            {
                Name = "Early Bird",
                Description = "Book 7+ days in advance for 5% off",
                DiscountPercent = 5,
                ApplicableFor = "Early bird",
                Conditions = new List<string> { "Book at least 7 days before play date" }
            }
        };
    }

    public async Task<PricingResponseDto> CalculatePricingAsync(int courtId, DateOnly date, TimeOnly startTime, decimal durationHours)
    {
        // Determine day type
        var dayOfWeek = date.ToDateTime(TimeOnly.MinValue).DayOfWeek;
        var dayType = (dayOfWeek == DayOfWeek.Saturday || dayOfWeek == DayOfWeek.Sunday) ? "Weekend" : "Weekday";

        // Get applicable pricing rule
        var pricingRule = await _context.PricingRules
            .Where(pr => pr.CourtId == courtId &&
                        pr.DayType == dayType &&
                        pr.IsActive &&
                        pr.EffectiveFrom <= date &&
                        (pr.EffectiveTo == null || pr.EffectiveTo >= date) &&
                        pr.TimeSlotStart <= startTime &&
                        pr.TimeSlotEnd > startTime)
            .OrderByDescending(pr => pr.EffectiveFrom)
            .FirstOrDefaultAsync();

        if (pricingRule == null)
        {
            throw new InvalidOperationException("No pricing rule found for the specified time");
        }

        var totalAmount = pricingRule.PricePerHour * durationHours;

        return new PricingResponseDto
        {
            PricePerHour = pricingRule.PricePerHour,
            DurationHours = durationHours,
            TotalAmount = totalAmount,
            DayType = dayType,
            TimeRange = $"{startTime:HH:mm} - {durationHours} giờ"
        };
    }

    public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto request, int userId)
    {
        // Calculate end time
        var endTime = request.StartTime.AddHours((double)request.DurationHours);

        // Check availability
        var availability = await CheckAvailabilityAsync(request.CourtId, request.BookingDate, request.StartTime, endTime);
        if (!availability.Available)
        {
            throw new InvalidOperationException(availability.Message);
        }

        // Calculate pricing
        var pricing = await CalculatePricingAsync(request.CourtId, request.BookingDate, request.StartTime, request.DurationHours);

        // Generate booking number
        var bookingNumber = $"BK{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";

        // Create booking
        var booking = new Booking
        {
            UserId = userId,
            BookingNumber = bookingNumber,
            TotalAmount = pricing.TotalAmount,
            BookingStatusId = 1, // Confirmed
            CreatedAt = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        // Create booking detail
        var bookingDetail = new BookingDetail
        {
            BookingId = booking.BookingId,
            CourtId = request.CourtId,
            SlotDate = request.BookingDate,
            StartTime = request.StartTime,
            EndTime = endTime,
            LineAmount = pricing.TotalAmount,
            CreatedAt = DateTime.UtcNow
        };

        _context.BookingDetails.Add(bookingDetail);

        // Update time slots to booked status
        var timeSlots = await _context.TimeSlots
            .Where(ts => ts.CourtId == request.CourtId &&
                        ts.SlotDate == request.BookingDate &&
                        ts.StartTime >= request.StartTime &&
                        ts.StartTime < endTime &&
                        ts.TimeSlotStatusId == 1)
            .ToListAsync();

        foreach (var slot in timeSlots)
        {
            slot.TimeSlotStatusId = 2; // Booked
        }

        await _context.SaveChangesAsync();

        // Get court name
        var court = await _context.Courts.FindAsync(request.CourtId);

        return new BookingResponseDto
        {
            BookingId = booking.BookingId,
            BookingNumber = bookingNumber,
            CourtId = request.CourtId,
            CourtName = court?.CourtName ?? "",
            BookingDate = request.BookingDate,
            StartTime = request.StartTime,
            EndTime = endTime,
            DurationHours = request.DurationHours,
            TotalAmount = pricing.TotalAmount,
            Status = "Confirmed",
            CustomerName = request.CustomerName,
            CustomerPhone = request.CustomerPhone,
            CustomerEmail = request.CustomerEmail,
            Notes = request.Notes,
            CreatedAt = booking.CreatedAt
        };
    }

    public async Task<BookingResponseDto?> GetBookingByIdAsync(int bookingId)
    {
        var booking = await _context.Bookings
            .Include(b => b.BookingDetails)
            .ThenInclude(bd => bd.Court)
            .Include(b => b.BookingStatus)
            .FirstOrDefaultAsync(b => b.BookingId == bookingId);

        if (booking == null)
            return null;

        var detail = booking.BookingDetails.FirstOrDefault();
        if (detail == null)
            return null;

        return new BookingResponseDto
        {
            BookingId = booking.BookingId,
            BookingNumber = booking.BookingNumber,
            CourtId = detail.CourtId,
            CourtName = detail.Court.CourtName,
            BookingDate = detail.SlotDate,
            StartTime = detail.StartTime,
            EndTime = detail.EndTime,
            DurationHours = (decimal)(detail.EndTime.ToTimeSpan() - detail.StartTime.ToTimeSpan()).TotalHours,
            TotalAmount = booking.TotalAmount,
            Status = booking.BookingStatus.StatusName,
            CreatedAt = booking.CreatedAt
        };
    }

    public async Task<List<BookingResponseDto>> GetUserBookingsAsync(int userId, string? status = null)
    {
        var query = _context.Bookings
            .Include(b => b.BookingDetails)
            .ThenInclude(bd => bd.Court)
            .Include(b => b.BookingStatus)
            .Where(b => b.UserId == userId);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(b => b.BookingStatus.StatusName == status);
        }

        var bookings = await query
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return bookings.Select(b =>
        {
            var detail = b.BookingDetails.FirstOrDefault();
            return new BookingResponseDto
            {
                BookingId = b.BookingId,
                BookingNumber = b.BookingNumber,
                CourtId = detail?.CourtId ?? 0,
                CourtName = detail?.Court.CourtName ?? "",
                BookingDate = detail?.SlotDate ?? DateOnly.MinValue,
                StartTime = detail?.StartTime ?? TimeOnly.MinValue,
                EndTime = detail?.EndTime ?? TimeOnly.MinValue,
                DurationHours = detail != null ? (decimal)(detail.EndTime.ToTimeSpan() - detail.StartTime.ToTimeSpan()).TotalHours : 0,
                TotalAmount = b.TotalAmount,
                Status = b.BookingStatus.StatusName,
                CreatedAt = b.CreatedAt
            };
        }).ToList();
    }

    public async Task<bool> CancelBookingAsync(int bookingId, int userId, string? reason = null)
    {
        var booking = await _context.Bookings
            .Include(b => b.BookingDetails)
            .FirstOrDefaultAsync(b => b.BookingId == bookingId && b.UserId == userId);

        if (booking == null)
            return false;

        // Update booking status to cancelled (assuming StatusId = 3)
        booking.BookingStatusId = 3;

        // Release time slots
        var detail = booking.BookingDetails.FirstOrDefault();
        if (detail != null)
        {
            var timeSlots = await _context.TimeSlots
                .Where(ts => ts.CourtId == detail.CourtId &&
                            ts.SlotDate == detail.SlotDate &&
                            ts.StartTime >= detail.StartTime &&
                            ts.StartTime < detail.EndTime)
                .ToListAsync();

            foreach (var slot in timeSlots)
            {
                slot.TimeSlotStatusId = 1; // Available again
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<CheckAvailabilityResponseDto> CheckAvailabilityAsync(int courtId, DateOnly date, TimeOnly startTime, TimeOnly endTime)
    {
        var bookedSlots = await _context.TimeSlots
            .Where(ts => ts.CourtId == courtId &&
                        ts.SlotDate == date &&
                        ts.StartTime >= startTime &&
                        ts.StartTime < endTime &&
                        ts.TimeSlotStatusId == 2) // Booked
            .AnyAsync();

        return new CheckAvailabilityResponseDto
        {
            Available = !bookedSlots,
            Message = bookedSlots ? "Some slots are already booked" : "All slots available"
        };
    }
}