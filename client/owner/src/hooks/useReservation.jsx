import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { bookingApi, facilityApi } from "../services/api";

const useReservation = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [duration, setDuration] = useState(1);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [timeSlots, setTimeSlots] = useState({ openTime: "06:00 AM", closeTime: "10:00 PM" });
  const [pricePerHour, setPricePerHour] = useState(100000);
  const [facility, setFacility] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableCourts, setAvailableCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);

  // Fetch facility details
  useEffect(() => {
    const fetchFacility = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await facilityApi.getFacilityById(id);
        setFacility(data);
        
        // Set operating hours if available
        if (data.openTime && data.closeTime) {
          setTimeSlots({
            openTime: data.openTime,
            closeTime: data.closeTime
          });
        }
      } catch (error) {
        console.error("Error fetching facility:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFacility();
  }, [id]);

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!id || !selectedDate) return;
      
      try {
        setLoading(true);
        const response = await bookingApi.getAvailableTimeSlots({
          facilityId: parseInt(id),
          date: format(selectedDate, "yyyy-MM-dd"),
        });
        
        const slots = response.slots || response.data?.slots || [];
        setAvailableSlots(slots);
        
        // Extract unique time slots
        const times = [...new Set(slots.map(slot => {
          const time = new Date(`2000-01-01T${slot.startTime}`);
          return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        }))];
        setAvailableTimes(times);
        
        // Set price from first slot
        if (slots.length > 0) {
          setPricePerHour(slots[0].price);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
        setAvailableSlots([]);
        setAvailableTimes([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSlots();
  }, [id, selectedDate]);

  // Fetch available courts when time and duration are selected
  useEffect(() => {
    const fetchAvailableCourts = async () => {
      if (!selectedStartTime || !duration || !availableSlots.length) {
        setAvailableCourts([]);
        setSelectedCourt(null);
        return;
      }

      try {
        // Group slots by court
        const courtMap = new Map();
        
        availableSlots.forEach(slot => {
          const slotTime = new Date(`2000-01-01T${slot.startTime}`);
          const formattedTime = slotTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          
          if (formattedTime === selectedStartTime) {
            if (!courtMap.has(slot.courtId)) {
              courtMap.set(slot.courtId, {
                courtId: slot.courtId,
                courtName: slot.courtName || `Sân ${slot.courtId}`,
                price: slot.price,
                isAvailable: slot.status === 'Available',
                isIndoor: slot.isIndoor,
                hasLighting: slot.hasLighting,
                type: slot.courtType || 'Standard',
                surfaceName: slot.surfaceName || 'Synthetic',
                description: slot.description
              });
            }
          }
        });
        
        const courts = Array.from(courtMap.values());
        setAvailableCourts(courts);
        
        // Auto-select if only one court available
        const availableCourtsOnly = courts.filter(c => c.isAvailable);
        if (availableCourtsOnly.length === 1) {
          setSelectedCourt(availableCourtsOnly[0]);
        } else if (availableCourtsOnly.length === 0) {
          setSelectedCourt(null);
        }
      } catch (error) {
        console.error('Error processing courts:', error);
      }
    };

    fetchAvailableCourts();
  }, [selectedStartTime, duration, availableSlots]);

  // Fetch pricing when time/duration changes
  useEffect(() => {
    const fetchPricing = async () => {
      if (!selectedStartTime || !duration || !availableSlots.length) return;
      
      // Extract duration value safely
      const durationValue = typeof duration === 'object' ? (duration?.value || 1) : Number(duration) || 1;
      
      try {
        // Find the selected slot to get courtId
        const selectedSlot = availableSlots.find(slot => {
          const time = new Date(`2000-01-01T${slot.startTime}`);
          const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          return formattedTime === selectedStartTime;
        });
        
        if (selectedSlot) {
          const response = await bookingApi.calculatePricing({
            courtId: selectedSlot.courtId,
            date: format(selectedDate, "yyyy-MM-dd"),
            startTime: selectedSlot.startTime,
            durationHours: durationValue,
          });
          
          setPricing(response);
          setPricePerHour(response.pricePerHour || selectedSlot.price);
        }
      } catch (error) {
        console.error("Error fetching pricing:", error);
      }
    };
    
    fetchPricing();
  }, [selectedStartTime, duration, selectedDate, availableSlots]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedStartTime(null);
    setDuration(1);
  };

  const handleTimeSelection = (time) => {
    setSelectedStartTime(time);
    setDuration(1);
  };

  const handleDurationChange = (newDuration) => {
    // Extract value from event or object
    const value = typeof newDuration === 'object' 
      ? (newDuration?.target?.value || newDuration?.value || 1) 
      : Number(newDuration) || 1;
    setDuration(value);
  };

  const isTimeSlotBooked = (time) => {
    // Check if the time slot exists in available slots
    return !availableSlots.some(slot => {
      const slotTime = new Date(`2000-01-01T${slot.startTime}`);
      const formattedTime = slotTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      return formattedTime === time;
    });
  };

  const isDurationAvailable = (startTime, durationHours) => {
    if (!startTime || !durationHours) return false;
    
    // Find start slot index
    const startSlot = availableSlots.find(slot => {
      const time = new Date(`2000-01-01T${slot.startTime}`);
      const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      return formattedTime === startTime;
    });
    
    if (!startSlot) return false;
    
    // For now, return true if we have pricing
    return true;
  };

  const confirmReservation = async () => {
    if (!selectedStartTime || !duration) {
      alert("Vui lòng chọn đầy đủ thông tin");
      return null;
    }
    
    // Extract duration value safely
    const durationValue = typeof duration === 'object' ? (duration?.value || 1) : Number(duration) || 1;
    
    try {
      setLoading(true);
      
      // Find the selected slot
      const selectedSlot = availableSlots.find(slot => {
        const time = new Date(`2000-01-01T${slot.startTime}`);
        const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        return formattedTime === selectedStartTime;
      });
      
      if (!selectedSlot) {
        alert("Không tìm thấy slot đã chọn");
        return null;
      }
      
      const bookingData = {
        courtId: selectedSlot.courtId,
        bookingDate: format(selectedDate, "yyyy-MM-dd"),
        startTime: selectedSlot.startTime,
        durationHours: durationValue,
        customerName: "Guest User", // Should get from auth context
        customerPhone: "0909123456", // Should get from user profile
      };
      
      const result = await bookingApi.createBooking(bookingData);
      alert("Đặt sân thành công!");
      console.log("Booking result:", result);
      return result; // Return result để component biết đặt thành công
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Đặt sân thất bại: " + (error.message || "Unknown error"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedDate,
    selectedStartTime,
    duration,
    availableTimes,
    timeSlots,
    handleDateChange,
    handleTimeSelection,
    handleDurationChange,
    isTimeSlotBooked,
    isDurationAvailable,
    confirmReservation,
    pricePerHour,
    loading,
    availableCourts,
    selectedCourt,
    setSelectedCourt,
  };
};

export default useReservation;
