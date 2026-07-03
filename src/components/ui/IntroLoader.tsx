"use client";

import React, { useState, useEffect } from "react";
import { Trees, Compass, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Connecting to TravelPal gateway...");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Standard travel booking database status prompts
    const statusMessages = [
      "Connecting to TravelPal gateway...",
      "Retrieving luxury eco-lodge reservations...",
      "Loading Kyoto & Western Ghats travel guides...",
      "Synchronizing carbon-neutral flight logs...",
      "Preparing your bespoke nature sanctuary itinerary...",
    ];

    const messageInterval = setInterval(() => {
      setStatus((prev) => {
        const currentIdx = statusMessages.indexOf(prev);
        const nextIdx = (currentIdx + 1) % statusMessages.length;
        return statusMessages[nextIdx];
      });
    }, 850);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800); // Wait for exit animation
          }, 300);
          return 100;
        }
        return prev + 4; // increments smoothly
      });
    }, 90);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 w-screen h-screen z-[100] flex flex-col items-center justify-center text-center p-0 m-0 select-none overflow-hidden bg-black"
        >
          {/* 1. Full Screen HD Forest Sunrise Background (Watermark-free) */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center -z-20 brightness-[0.38] contrast-[1.1] scale-105 transition-all duration-700"
            style={{ backgroundImage: "url('/loading_bg.jpg')" }}
          />

          {/* Dark overlay mask */}
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50 -z-10" />

          {/* 2. Glassmorphic Core Loading Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md mx-auto px-8 py-10 rounded-3xl border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-6"
          >
            {/* Pulsing Icon Shield */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 animate-pulse">
              <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
            </div>

            {/* Travel Branding */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 text-[9px] font-bold text-emerald-300 uppercase tracking-widest">
                <Trees className="w-3 h-3" /> TRAVELPAL SANCTUARY
              </div>
              <h2 className="text-2xl font-bold font-title text-white tracking-widest mt-2">
                TRAVELPAL
              </h2>
              <p className="text-[10px] text-white/50 tracking-widest uppercase">
                Luxury Eco-escapes & Lodging
              </p>
            </div>

            {/* Dynamic Status message */}
            <div className="w-full h-8 flex items-center justify-center">
              <p className="text-xs font-light text-emerald-200/80 italic animate-pulse">
                {status}
              </p>
            </div>

            {/* Standard Progress Bar */}
            <div className="w-full space-y-2 mt-2">
              <div className="w-full bg-white/10 dark:bg-emerald-950/30 h-2 rounded-full overflow-hidden border border-white/5 relative">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-100 ease-out shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-emerald-300/80 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> SECURE GATEWAY
                </span>
                <span className="font-bold">{progress}%</span>
              </div>
            </div>
          </motion.div>

          {/* Absolute bottom certification label */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 text-[9px] font-bold tracking-widest text-white/40 uppercase">
            <span>Carbon Neutral</span>
            <span>•</span>
            <span>100% Certified Eco-tourism</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
