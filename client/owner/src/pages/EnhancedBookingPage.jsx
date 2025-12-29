import React from "react";
import { useEnhancedBooking } from "../hooks/useEnhancedBooking";
import { TimeSelection } from "../components/Reservation";
import { Calendar, RefreshCw, AlertCircle } from "lucide-react";
import { format } from "date-fns";

/**
 * Enhanced Booking Page - Demo
 */
export const EnhancedBookingPage = () => {
  const {
    // Date selection
    selectedDate,
    setSelectedDate,

    // Slot selection
    selectedSlots,
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

    // State
    loading,
    error,

    // Actions
    refetch,
  } = useEnhancedBooking();

  // Handle booking submission
  const handleBooking = () => {
    const validation = validateSelection();

    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    // TODO: Implement booking submission
    console.log("Booking data:", {
      selectedSlots,
      totalDuration,
      finalTotal,
      date: selectedDate,
    });

    alert("Booking feature coming soon! Check console for booking data.");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🏸 Book Your Court</h1>
          <p className="text-gray-600">
            Select your preferred time slots with enhanced pricing and discounts
          </p>
        </div>

        {/* Date Selector */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Calendar className="h-6 w-6 text-primary" />
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Select Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered input-primary"
                    value={format(selectedDate, "yyyy-MM-dd")}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
              </div>

              <button
                className="btn btn-outline btn-primary gap-2"
                onClick={refetch}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {/* Facility Info */}
            {enhancedAvailability && (
              <div className="mt-4 p-4 bg-base-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Operating Hours:</span>
                    <p className="text-gray-600">
                      {format(
                        new Date(`2000-01-01T${enhancedAvailability.openTime}`),
                        "HH:mm"
                      )}{" "}
                      -{" "}
                      {format(
                        new Date(`2000-01-01T${enhancedAvailability.closeTime}`),
                        "HH:mm"
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Available Slots:</span>
                    <p className="text-gray-600">
                      {enhancedAvailability.availableSlots} /{" "}
                      {enhancedAvailability.totalSlots}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>
                    {enhancedAvailability.isOvernightOperation && (
                      <span className="badge badge-info ml-2">
                        Overnight Operation
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error mb-6">
            <AlertCircle className="h-6 w-6" />
            <span>{error}</span>
          </div>
        )}

        {/* Enhanced Time Selection */}
        <TimeSelection
          slots={availableSlots}
          selectedSlots={selectedSlots}
          onSlotClick={handleSlotClick}
          onRangeSelection={handleRangeSelection}
          onClearSelection={clearSelection}
          onConfirmBooking={handleBooking}
          priceRanges={priceRanges}
          discounts={discounts}
          bookingRules={bookingRules}
          userStats={userStats}
          totalDuration={totalDuration}
          baseTotal={baseTotal}
          discountAmount={discountAmount}
          finalTotal={finalTotal}
          loading={loading}
        />

        {/* Action Buttons */}
        {selectedSlots.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-4 border-primary p-6 z-50">
            <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm text-gray-600">
                  {selectedSlots.length} slot(s) selected • {totalDuration}h duration
                </p>
                <p className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(finalTotal)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  className="btn btn-outline"
                  onClick={clearSelection}
                >
                  Clear
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleBooking}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-6 bg-info bg-opacity-10 rounded-lg border border-info">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            How to Book
          </h3>
          <ul className="space-y-2 text-sm">
            <li>✅ Click on any available time slot to select</li>
            <li>✅ Hold <kbd className="kbd kbd-sm">Shift</kbd> and click another slot to select multiple consecutive slots</li>
            <li>✅ Green slots have discounts applied automatically</li>
            <li>✅ Orange slots are peak times with higher demand</li>
            <li>✅ Select 10+ slots to get 15% bulk discount</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBookingPage;
