import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { bookingApi } from "../services/api";

/**
 * Enhanced booking hook with dynamic slots, multi-selection, and pricing
 */
export const useEnhancedBooking = () => {
  const { id } = useParams();
  
  // Date and time selection
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]); // Array of selected slot objects
  const [selectedTimes, setSelectedTimes] = useState([]); // Array of time strings for display
  
  // Enhanced availability data
  const [enhancedAvailability, setEnhancedAvailability] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingRules, setBookingRules] = useState(null);
  const [priceRanges, setPriceRanges] = useState({});
  const [discounts, setDiscounts] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Booking summary
  const [totalDuration, setTotalDuration] = useState(0);
  const [baseTotal, setBaseTotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  
  // User booking stats
  const [userStats, setUserStats] = useState({
    todayHours: 0,
    weekBookings: 0,
    isPremiumUser: false,
  });
  
  /**
   * Fetch enhanced availability with dynamic slots
   */
  const fetchEnhancedAvailability = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch availability and user stats in parallel
      const [availabilityResponse, userBookingsToday, userBookingsWeek] = await Promise.all([
        bookingApi.getEnhancedAvailability({
          facilityId: parseInt(id),
          date: format(selectedDate, "yyyy-MM-dd"),
        }),
        bookingApi.getMyBookings({
          date: format(selectedDate, "yyyy-MM-dd"),
          status: "Confirmed"
        }).catch(() => ({ data: [] })),
        bookingApi.getMyBookings({
          startDate: format(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
          endDate: format(selectedDate, "yyyy-MM-dd"),
          status: "Confirmed"
        }).catch(() => ({ data: [] }))
      ]);
      
      console.log("🎯 Enhanced Availability:", availabilityResponse);
      
      setEnhancedAvailability(availabilityResponse);
      setAvailableSlots(availabilityResponse.slots || []);
      setBookingRules(availabilityResponse.rules);
      setPriceRanges(availabilityResponse.priceRanges || {});
      setDiscounts(availabilityResponse.availableDiscounts || []);
      
      // Calculate user stats
      const todayBookings = Array.isArray(userBookingsToday.data) ? userBookingsToday.data : userBookingsToday;
      const weekBookings = Array.isArray(userBookingsWeek.data) ? userBookingsWeek.data : userBookingsWeek;
      
      const todayHours = todayBookings.reduce((sum, b) => sum + (b.durationHours || 0), 0);
      
      setUserStats({
        todayHours,
        weekBookings: weekBookings.length,
        isPremiumUser: availabilityResponse.rules?.isPremiumUser || false,
      });
      
    } catch (err) {
      console.error("Error fetching enhanced availability:", err);
      setError(err.message || "Failed to load availability");
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  }, [id, selectedDate]);
  
  /**
   * Handle single slot selection/deselection
   */
  const handleSlotClick = useCallback((slot) => {
    console.log("🎯 Slot clicked:", slot);
    
    setSelectedSlots(prev => {
      console.log("Previous selected:", prev.length);
      
      const isSelected = prev.some(s => 
        s.courtId === slot.courtId && 
        s.startTime === slot.startTime
      );
      
      console.log("Is already selected?", isSelected);
      
      if (isSelected) {
        // Deselect
        const newSelection = prev.filter(s => 
          !(s.courtId === slot.courtId && s.startTime === slot.startTime)
        );
        console.log("After deselect:", newSelection.length);
        return newSelection;
      } else {
        // Select - check rules
        if (!slot.isAvailable) {
          console.log("❌ Slot not available");
          alert("This slot is not available");
          return prev;
        }
        
        // Add to selection
        const newSelection = [...prev, slot].sort((a, b) => 
          a.startTime.localeCompare(b.startTime)
        );
        console.log("After select:", newSelection.length);
        return newSelection;
      }
    });
  }, []);
  
  /**
   * Handle consecutive multi-slot selection (shift+click)
   */
  const handleRangeSelection = useCallback((startSlot, endSlot) => {
    const courtSlots = availableSlots.filter(s => s.courtId === startSlot.courtId);
    const startIdx = courtSlots.findIndex(s => s.startTime === startSlot.startTime);
    const endIdx = courtSlots.findIndex(s => s.startTime === endSlot.startTime);
    
    if (startIdx === -1 || endIdx === -1) return;
    
    const [from, to] = startIdx < endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
    const rangeSlots = courtSlots.slice(from, to + 1);
    
    // Check if all slots in range are available
    const allAvailable = rangeSlots.every(s => s.isAvailable);
    if (!allAvailable) {
      alert("Some slots in this range are not available");
      return;
    }
    
    // Check consecutive rule
    const isConsecutive = rangeSlots.every((slot, idx) => {
      if (idx === 0) return true;
      const prevSlot = rangeSlots[idx - 1];
      return prevSlot.endTime === slot.startTime;
    });
    
    if (!isConsecutive) {
      alert("Selected slots must be consecutive");
      return;
    }
    
    setSelectedSlots(rangeSlots);
  }, [availableSlots]);
  
  /**
   * Clear all selections
   */
  const clearSelection = useCallback(() => {
    setSelectedSlots([]);
    setSelectedTimes([]);
  }, []);
  
  /**
   * Calculate booking summary when selection changes
   */
  useEffect(() => {
    if (selectedSlots.length === 0) {
      setTotalDuration(0);
      setBaseTotal(0);
      setDiscountAmount(0);
      setFinalTotal(0);
      setSelectedTimes([]);
      return;
    }
    
    // Calculate duration in hours
    const duration = selectedSlots.reduce((total, slot) => {
      const start = new Date(`2000-01-01T${slot.startTime}`);
      const end = new Date(`2000-01-01T${slot.endTime}`);
      return total + (end - start) / (1000 * 60 * 60);
    }, 0);
    
    // Calculate base total
    const base = selectedSlots.reduce((sum, slot) => sum + slot.currentPrice, 0);
    
    // Calculate discount
    let discount = 0;
    selectedSlots.forEach(slot => {
      if (slot.discountPercent > 0) {
        discount += slot.currentPrice * (slot.discountPercent / 100);
      }
    });
    
    // Apply bulk discount if applicable (10+ bookings = 15% off)
    if (selectedSlots.length >= 10) {
      const bulkDiscount = base * 0.15;
      discount = Math.max(discount, bulkDiscount);
    }
    
    const final = base - discount;
    
    setTotalDuration(duration);
    setBaseTotal(base);
    setDiscountAmount(discount);
    setFinalTotal(final);
    
    // Update selected times for display
    const times = selectedSlots.map(slot => {
      const time = new Date(`2000-01-01T${slot.startTime}`);
      return time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    });
    setSelectedTimes(times);
    
  }, [selectedSlots]);
  
  /**
   * Validate selection against booking rules
   */
  const validateSelection = useCallback(() => {
    if (!bookingRules || selectedSlots.length === 0) return { valid: false, message: "" };
    
    // Check minimum duration
    if (totalDuration < bookingRules.minimumDurationHours) {
      return {
        valid: false,
        message: `Minimum booking duration is ${bookingRules.minimumDurationHours} hour(s)`
      };
    }
    
    // Check maximum consecutive slots (3 for regular, 5 for premium)
    const maxConsecutive = userStats.isPremiumUser 
      ? (bookingRules.premiumMaxConsecutiveSlots || 5)
      : bookingRules.maxConsecutiveSlots;
    
    if (selectedSlots.length > maxConsecutive) {
      return {
        valid: false,
        message: userStats.isPremiumUser
          ? `Premium members can book maximum ${maxConsecutive} consecutive hours`
          : `Maximum ${maxConsecutive} consecutive hours per booking. Upgrade to Premium for more!`
      };
    }
    
    // Check daily limit (4 hours for regular, 8 for premium)
    const maxDailyHours = userStats.isPremiumUser ? 8 : (bookingRules.maxSlotsPerUserPerDay || 4);
    const newTotalToday = userStats.todayHours + totalDuration;
    
    if (newTotalToday > maxDailyHours) {
      const remaining = maxDailyHours - userStats.todayHours;
      return {
        valid: false,
        message: remaining > 0
          ? `You can only book ${remaining} more hour(s) today (${maxDailyHours}h daily limit). Already booked: ${userStats.todayHours}h`
          : `Daily limit reached! You've already booked ${userStats.todayHours}h today (${maxDailyHours}h limit)`
      };
    }
    
    // Check weekly limit (10 for regular, 20 for premium)
    const maxWeeklyBookings = userStats.isPremiumUser ? 20 : (bookingRules.maxBookingsPerUserPerWeek || 10);
    
    if (userStats.weekBookings >= maxWeeklyBookings) {
      return {
        valid: false,
        message: `Weekly booking limit reached! You've made ${userStats.weekBookings}/${maxWeeklyBookings} bookings this week`
      };
    }
    
    // Check advance booking window (7 days for regular, 30 for premium)
    const maxAdvanceDays = userStats.isPremiumUser
      ? (bookingRules.premiumMaxAdvanceBookingDays || 30)
      : bookingRules.maxAdvanceBookingDays;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(0, 0, 0, 0);
    const daysAhead = Math.floor((bookingDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysAhead > maxAdvanceDays) {
      return {
        valid: false,
        message: userStats.isPremiumUser
          ? `Premium members can book up to ${maxAdvanceDays} days in advance`
          : `You can only book ${maxAdvanceDays} days in advance. Upgrade to Premium for 30-day booking!`
      };
    }
    
    // Check minimum advance booking (2 hours for regular, 1 for premium)
    const minAdvanceHours = userStats.isPremiumUser ? 1 : (bookingRules.minAdvanceBookingHours || 2);
    const now = new Date();
    const firstSlotTime = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedSlots[0].startTime}`);
    const hoursUntilBooking = (firstSlotTime - now) / (1000 * 60 * 60);
    
    if (hoursUntilBooking < minAdvanceHours) {
      return {
        valid: false,
        message: `Bookings must be made at least ${minAdvanceHours} hour(s) in advance`
      };
    }
    
    // Check if slots are consecutive (same court)
    const courtIds = [...new Set(selectedSlots.map(s => s.courtId))];
    if (courtIds.length > 1) {
      return {
        valid: false,
        message: "Please select slots from the same court"
      };
    }
    
    // Check consecutive time slots
    for (let i = 1; i < selectedSlots.length; i++) {
      if (selectedSlots[i - 1].endTime !== selectedSlots[i].startTime) {
        return {
          valid: false,
          message: "Selected slots must be consecutive"
        };
      }
    }
    
    return { valid: true, message: "Booking is valid" };
  }, [selectedSlots, bookingRules, totalDuration, userStats, selectedDate]);
  
  /**
   * Get slot display class based on status
   */
  const getSlotClass = useCallback((slot) => {
    const isSelected = selectedSlots.some(s => 
      s.courtId === slot.courtId && 
      s.startTime === slot.startTime
    );
    
    if (!slot.isAvailable) return "slot-unavailable";
    if (isSelected) return "slot-selected";
    if (slot.isPeakTime) return "slot-peak";
    if (slot.discountPercent > 0) return "slot-discount";
    return "slot-available";
  }, [selectedSlots]);
  
  // Fetch availability when date changes
  useEffect(() => {
    fetchEnhancedAvailability();
  }, [fetchEnhancedAvailability]);
  
  return {
    // Date selection
    selectedDate,
    setSelectedDate,
    
    // Slot selection
    selectedSlots,
    selectedTimes,
    handleSlotClick,
    handleRangeSelection,
    clearSelection,
    
    // Availability data
    enhancedAvailability,
    availableSlots,
    bookingRules,
    priceRanges,
    discounts,
    
    // Booking summary
    totalDuration,
    baseTotal,
    discountAmount,
    finalTotal,
    
    // User stats
    userStats,
    
    // Validation
    validateSelection,
    
    // UI helpers
    getSlotClass,
    
    // State
    loading,
    error,
    
    // Actions
    refetch: fetchEnhancedAvailability,
  };
};
