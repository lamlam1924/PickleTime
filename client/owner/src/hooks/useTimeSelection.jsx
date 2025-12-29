import {  useEffect, useMemo } from "react";
import {
  format,
  parse,
  isBefore,
  isAfter,
  parseISO,
  addMinutes,
  addDays,
  addHours,
} from "date-fns";
import axiosInstance from "./useAxiosInstance";

const useTimeSelection = (
  selectedDate,
  turfId,
  setSelectedStartTime,
  setBookedTime,
  setTimeSlots,
  setPricePerHour,
  bookedTime,
  timeSlots,
  setDuration
) => {
  const availableTimes = useMemo(() => {
    if (!timeSlots.openTime || !timeSlots.closeTime) return [];

    const times = [];
    const openTime = parse(timeSlots.openTime, "hh:mm a", new Date());
    const closeTime = parse(timeSlots.closeTime, "hh:mm a", new Date());

    let currentTime = openTime;

    while (isBefore(currentTime, closeTime)) {
      times.push(format(currentTime, "hh:mm a"));
      // currentTime = addMinutes(currentTime, 60);
      currentTime = addHours(currentTime, 1);
    }

    return times;
  }, [timeSlots.openTime, timeSlots.closeTime]);

  const handleTimeSelection = (time) => {
    setSelectedStartTime(time);
    setDuration(1);
  };

  const isTimeSlotBooked = (time) => {
    const timeToCheck = parse(time, "hh:mm a", new Date());
    return bookedTime.some((booking) => {
      const bookingStart = parse(booking.startTime, "hh:mm a", new Date());
      let bookingEnd = parse(booking.endTime, "hh:mm a", new Date());

      if (isBefore(bookingEnd, bookingStart)) {
        bookingEnd = addDays(bookingEnd, 1);
      }

      return (
        (isAfter(timeToCheck, bookingStart) ||
          isSameTime(timeToCheck, bookingStart)) &&
        isBefore(timeToCheck, bookingEnd)
      );
    });
  };

  const isSameTime = (time1, time2) => {
    return (
      time1.getHours() === time2.getHours() &&
      time1.getMinutes() === time2.getMinutes()
    );
  };

  const fetchByDate = async (currentSelectedDate, turfId) => {
    const date = format(currentSelectedDate, "yyyy-MM-dd");

    try {
      // Use new booking API endpoint
      const response = await axiosInstance.get(
        `/bookings/available-slots?facilityId=${turfId}&date=${date}`
      );
      const result = response.data || response;
      
      // Map new API response to old format for backward compatibility
      if (result.slots && result.slots.length > 0) {
        const firstSlot = result.slots[0];
        const facility = {
          openTime: "06:00 AM", // Default, should get from facility API
          closeTime: "10:00 PM",
          pricePerHour: firstSlot.price || 100000
        };
        setTimeSlots(facility);
        setPricePerHour(firstSlot.price || 100000);
        
        // Map booked times from available slots (inverse logic)
        // For now, set empty as we only get available slots
        setBookedTime([]);
      } else {
        // No slots available
        setTimeSlots({ openTime: "06:00 AM", closeTime: "10:00 PM", pricePerHour: 100000 });
        setPricePerHour(100000);
        setBookedTime([]);
      }
    } catch (error) {
      console.log("Error in fetchByDate", error.message);
      // Set defaults on error
      setTimeSlots({ openTime: "06:00 AM", closeTime: "10:00 PM", pricePerHour: 100000 });
      setPricePerHour(100000);
      setBookedTime([]);
    }
  };

  useEffect(() => {
    fetchByDate(selectedDate, turfId);
  }, [selectedDate, turfId]);

  return {
    availableTimes,
    handleTimeSelection,
    isTimeSlotBooked,
  };
};

export default useTimeSelection;
