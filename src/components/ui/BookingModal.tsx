"use client";

import React, { useState, useEffect } from "react";
import { useTravel, Package, Booking } from "@/context/TravelContext";
import { X, Calendar, Users, ShieldCheck, CreditCard, Sparkles, CheckCircle2, Ticket, Home, Tent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: Package | null;
}

export default function BookingModal({ isOpen, onClose, selectedPackage }: BookingModalProps) {
  const { addBooking, isLoggedIn, login } = useTravel();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"package" | "hotel" | "activity">("package");
  const [checkoutStep, setCheckoutStep] = useState<"customize" | "payment" | "success">("customize");

  // Customization States
  const [travelers, setTravelers] = useState(1);
  const [bookingDate, setBookingDate] = useState("");
  const [hotelCabinType, setHotelCabinType] = useState("Glass Dome Suite");
  const [hotelNights, setHotelNights] = useState(3);
  const [activityType, setActivityType] = useState("Sunrise Zen Photography");
  const [guideRequested, setGuideRequested] = useState(true);

  // Payment States
  const [cardNumber, setCardNumber] = useState("4000 1234 5678 9010");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvv, setCardCvv] = useState("123");
  const [cardName, setCardName] = useState("Alex Forester");
  const [isProcessing, setIsProcessing] = useState(false);

  // Auth helper
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCheckoutStep("customize");
      // Default to package if one was selected
      if (selectedPackage) {
        setActiveTab("package");
      }
    }
  }, [isOpen, selectedPackage]);

  if (!isOpen) return null;

  // Invoice Math
  const getPricing = () => {
    let subtotal = 0;
    let description = "";

    if (activeTab === "package") {
      const base = selectedPackage ? selectedPackage.price : 1500;
      const guidePrice = guideRequested ? 150 : 0;
      subtotal = (base + guidePrice) * travelers;
      description = `${selectedPackage?.title || "Custom AI Trip"} Package for ${travelers} travelers`;
    } else if (activeTab === "hotel") {
      const baseRate = hotelCabinType === "Glass Dome Suite" ? 380 : hotelCabinType === "Canopy Treehouse" ? 480 : 250;
      subtotal = baseRate * hotelNights;
      description = `${hotelCabinType} stay for ${hotelNights} Nights`;
    } else {
      const baseAct = activityType === "Sunrise Zen Photography" ? 120 : activityType === "Glacier River Rafting" ? 180 : 80;
      subtotal = baseAct * travelers;
      description = `${activityType} tickets for ${travelers} travelers`;
    }

    const taxes = subtotal * 0.08; // 8% eco tax
    const total = subtotal + taxes;

    return { subtotal, taxes, total, description };
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-login guest if they input detail and aren't logged in
    if (!isLoggedIn && guestName && guestEmail) {
      login(guestName, guestEmail);
    }

    setCheckoutStep("payment");
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate transaction
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep("success");

      const pricing = getPricing();
      
      // Save booking in state
      addBooking({
        type: activeTab,
        itemId: selectedPackage?.id || `custom-${activeTab}`,
        itemName: selectedPackage?.title || (activeTab === "hotel" ? hotelCabinType : activityType),
        price: pricing.total,
        date: bookingDate || new Date().toISOString().split("T")[0],
        travelers: travelers,
        details: pricing.description,
      });

      // Fire success confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#1B5E20", "#2E7D32", "#00bcd4", "#ffffff"]
      });
    }, 2500);
  };

  const pricing = getPricing();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Blur Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Main Modal Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="glass-panel w-full max-w-2xl rounded-[36px] overflow-hidden shadow-2xl relative border z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-foreground/10 flex justify-between items-center bg-black/5 dark:bg-white/5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-forest dark:text-emerald-400">
              {checkoutStep === "customize" ? "Configure Escape" : checkoutStep === "payment" ? "Secure Checkout" : "Booking Confirmed"}
            </span>
            <h3 className="text-xl md:text-2xl font-title font-bold text-foreground">
              {selectedPackage ? selectedPackage.destination : "Luxury Travel Booking"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">

            {/* STEP 1: Customize */}
            {checkoutStep === "customize" && (
              <motion.div
                key="customize"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Tabs selection (Only if no specific package selected) */}
                {!selectedPackage && (
                  <div className="flex gap-2 p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border">
                    <button
                      onClick={() => setActiveTab("package")}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        activeTab === "package" ? "bg-forest text-white shadow" : "text-foreground"
                      }`}
                    >
                      <Ticket className="w-3.5 h-3.5 inline mr-1" /> Package
                    </button>
                    <button
                      onClick={() => setActiveTab("hotel")}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        activeTab === "hotel" ? "bg-forest text-white shadow" : "text-foreground"
                      }`}
                    >
                      <Home className="w-3.5 h-3.5 inline mr-1" /> Hotel
                    </button>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        activeTab === "activity" ? "bg-forest text-white shadow" : "text-foreground"
                      }`}
                    >
                      <Tent className="w-3.5 h-3.5 inline mr-1" /> Activity
                    </button>
                  </div>
                )}

                <form onSubmit={handleNextStep} className="space-y-6">
                  
                  {/* Package Customize Fields */}
                  {activeTab === "package" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-foreground/75">Departure Date</label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="p-3.5 rounded-xl glass-panel bg-transparent border-foreground/15 text-sm font-semibold focus:outline-none text-foreground dark:[color-scheme:dark]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-foreground/75">Travelers Count</label>
                        <select
                          value={travelers}
                          onChange={(e) => setTravelers(Number(e.target.value))}
                          className="p-3.5 rounded-xl glass-panel bg-transparent border-foreground/15 text-sm font-semibold focus:outline-none text-foreground"
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n} className="dark:bg-[#060e0a]">{n} {n === 1 ? "Traveler" : "Travelers"}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2 flex items-center justify-between p-4 glass-panel rounded-2xl">
                        <div>
                          <span className="block text-sm font-semibold text-foreground">Include Private Local Guide</span>
                          <span className="text-[10px] text-foreground/60">Adds $150 per person to the package for expert route mapping.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={guideRequested}
                          onChange={(e) => setGuideRequested(e.target.checked)}
                          className="w-5 h-5 rounded accent-forest cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Hotel Customize Fields */}
                  {activeTab === "hotel" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-foreground/75">Cabin Type</label>
                        <select
                          value={hotelCabinType}
                          onChange={(e) => setHotelCabinType(e.target.value)}
                          className="p-3.5 rounded-xl glass-panel bg-transparent border-foreground/15 text-sm font-semibold focus:outline-none text-foreground"
                        >
                          <option value="Glass Dome Suite" className="dark:bg-[#060e0a]">Glass Dome Suite ($380/night)</option>
                          <option value="Canopy Treehouse" className="dark:bg-[#060e0a]">Canopy Treehouse ($480/night)</option>
                          <option value="Forest Eco-Cabin" className="dark:bg-[#060e0a]">Forest Eco-Cabin ($250/night)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-foreground/75">Duration of Stay</label>
                        <select
                          value={hotelNights}
                          onChange={(e) => setHotelNights(Number(e.target.value))}
                          className="p-3.5 rounded-xl glass-panel bg-transparent border-foreground/15 text-sm font-semibold focus:outline-none text-foreground"
                        >
                          {[1, 2, 3, 4, 5, 7, 10].map((n) => (
                            <option key={n} value={n} className="dark:bg-[#060e0a]">{n} {n === 1 ? "Night" : "Nights"}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Activity Customize Fields */}
                  {activeTab === "activity" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-foreground/75">Eco Activity</label>
                        <select
                          value={activityType}
                          onChange={(e) => setActivityType(e.target.value)}
                          className="p-3.5 rounded-xl glass-panel bg-transparent border-foreground/15 text-sm font-semibold focus:outline-none text-foreground"
                        >
                          <option value="Sunrise Zen Photography" className="dark:bg-[#060e0a]">Sunrise Zen Photography ($120/person)</option>
                          <option value="Glacier River Rafting" className="dark:bg-[#060e0a]">Glacier River Rafting ($180/person)</option>
                          <option value="Shinrin-Yoku Forest Bathing" className="dark:bg-[#060e0a]">Shinrin-Yoku Forest Bathing ($80/person)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-foreground/75">Ticket Count</label>
                        <select
                          value={travelers}
                          onChange={(e) => setTravelers(Number(e.target.value))}
                          className="p-3.5 rounded-xl glass-panel bg-transparent border-foreground/15 text-sm font-semibold focus:outline-none text-foreground"
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n} className="dark:bg-[#060e0a]">{n} {n === 1 ? "Ticket" : "Tickets"}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Guest login helper if logged out */}
                  {!isLoggedIn && (
                    <div className="p-5 glass-panel rounded-2xl border border-yellow-500/20 space-y-3 bg-yellow-500/5">
                      <span className="block text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase">
                        Guest Checkout Account setup
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="p-2.5 rounded-xl glass-panel bg-transparent text-xs font-semibold focus:outline-none border-foreground/10 text-foreground"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Your Email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="p-2.5 rounded-xl glass-panel bg-transparent text-xs font-semibold focus:outline-none border-foreground/10 text-foreground"
                        />
                      </div>
                    </div>
                  )}

                  {/* Summary Invoice */}
                  <div className="p-5 bg-black/5 dark:bg-white/5 rounded-2xl border">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/60 block mb-2">Price Breakdown</span>
                    <div className="flex justify-between text-sm py-1.5 border-b border-foreground/10">
                      <span className="text-foreground/75 font-light">{pricing.description}</span>
                      <span className="font-semibold text-foreground">${pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1.5 border-b border-foreground/10">
                      <span className="text-foreground/60">8% Eco Carbon Tax</span>
                      <span className="font-semibold text-foreground">${pricing.taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold font-title pt-3">
                      <span>Total Invoice</span>
                      <span className="text-forest dark:text-emerald-400">${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Proceed to Payment</span>
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: Payment */}
            {checkoutStep === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Immersive Glass Credit Card */}
                <div className="w-full max-w-sm mx-auto h-48 rounded-2xl p-6 bg-gradient-to-br from-forest-light/60 to-emerald-600/30 backdrop-blur-xl border border-white/20 text-white flex flex-col justify-between shadow-xl relative overflow-hidden select-none">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="w-32 h-32" />
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <CreditCard className="w-10 h-10 text-emerald-300" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">Forest Bank Secure</span>
                  </div>

                  <div>
                    <span className="block text-lg font-mono tracking-widest">{cardNumber}</span>
                  </div>

                  <div className="flex justify-between text-xs font-mono uppercase">
                    <div>
                      <span className="block text-[8px] opacity-65">Cardholder</span>
                      <span>{cardName}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] opacity-65">Expires</span>
                      <span>{cardExpiry}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProcessPayment} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wide text-foreground/75">Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="p-3 rounded-xl glass-panel bg-transparent border-foreground/15 text-xs font-mono text-foreground focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wide text-foreground/75">Card Name</label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="p-3 rounded-xl glass-panel bg-transparent border-foreground/15 text-xs text-foreground focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wide text-foreground/75">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="p-3 rounded-xl glass-panel bg-transparent border-foreground/15 text-xs font-mono text-foreground focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wide text-foreground/75">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="p-3 rounded-xl glass-panel bg-transparent border-foreground/15 text-xs font-mono text-foreground focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-xs text-foreground/80">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Your transaction is carbon-neutral and secured with end-to-end local sandbox encryption.</span>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => setCheckoutStep("customize")}
                      className="px-5 py-2.5 border border-foreground/15 rounded-full text-xs font-bold text-foreground hover:bg-forest/5 cursor-pointer disabled:opacity-50"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-8 py-3 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-full font-bold shadow-md text-xs hover:scale-102 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing Eco Ledger...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Pay ${pricing.total.toFixed(2)}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: Success Screen */}
            {checkoutStep === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-16 h-16 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-title text-foreground">
                    Carbon Offset Secured!
                  </h3>
                  <p className="text-xs text-foreground/75 dark:text-emerald-100/60 font-light max-w-sm mx-auto">
                    Your luxury package is confirmed. We have officially recorded your trip offsetting parameters and registered your carbon-neutral footprint!
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="p-5 glass-panel rounded-2xl text-left text-xs max-w-sm mx-auto space-y-2.5">
                  <div className="flex justify-between border-b pb-2 border-foreground/10 font-bold">
                    <span>Transaction Receipt</span>
                    <span className="text-emerald-600 dark:text-emerald-400">SUCCESS</span>
                  </div>
                  <div className="flex justify-between text-foreground/80">
                    <span>Item:</span>
                    <span className="font-semibold text-foreground text-right max-w-[200px] truncate">{pricing.description}</span>
                  </div>
                  <div className="flex justify-between text-foreground/80">
                    <span>Date Registered:</span>
                    <span className="font-semibold text-foreground">{bookingDate || new Date().toISOString().split("T")[0]}</span>
                  </div>
                  <div className="flex justify-between text-foreground/80">
                    <span>Eco-Taxes & Offsets:</span>
                    <span className="font-semibold text-foreground">${pricing.taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-foreground/10">
                    <span>Total Charged:</span>
                    <span className="text-forest dark:text-emerald-400">${pricing.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-full text-xs font-bold shadow-md cursor-pointer"
                  >
                    Return to Forest Canopy
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
