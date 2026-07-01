"use client";

import React, { useState, useEffect } from "react";
import { Trees, Sparkles, Droplets } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Whispering bamboo canopy...");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Shifting status messages to match the local states
    const statusMessages = [
      "Whispering bamboo canopy...",
      "Pouring fresh Athirappilly cascades...",
      "Elevating Sahyadri mountain mist...",
      "Tuning local wind cycles...",
      "Connecting carbon-neutral gateway...",
    ];

    const messageInterval = setInterval(() => {
      setStatus((prev) => {
        const currentIdx = statusMessages.indexOf(prev);
        const nextIdx = (currentIdx + 1) % statusMessages.length;
        return statusMessages[nextIdx];
      });
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800); // Wait for fade-out exit
          }, 400);
          return 100;
        }
        return prev + 4;
      });
    }, 100);

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
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-gradient-to-b from-[#05110a] to-[#030905] flex flex-col items-center justify-center text-center p-6 select-none"
        >
          {/* Subtle nature mist overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,125,50,0.1)_0%,transparent_70%)] pointer-events-none" />

          {/* Core Animating Waterfall Ledge container */}
          <div className="relative w-28 h-40 flex justify-center mb-8">
            {/* Rocky ledge at top */}
            <div className="absolute top-0 w-24 h-4 bg-[#0d2315] rounded-full border border-emerald-900/30 z-20" />
            
            {/* Cascading falling water streams */}
            <div className="absolute top-2 w-16 bottom-2 bg-gradient-to-b from-cyan-400 via-teal-400 to-[#05110a] opacity-80 overflow-hidden rounded-b-xl border-x border-cyan-400/20 shadow-lg shadow-cyan-500/10">
              {/* Flowing overlay lines */}
              <div className="w-full h-[300%] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.4)_0%,transparent_20%,rgba(128,222,234,0.6)_40%,transparent_60%,rgba(255,255,255,0.4)_80%)] animate-waterfall-loader" />
            </div>

            {/* Rising mist spray at base */}
            <div className="absolute bottom-0 w-32 h-10 bg-cyan-400/10 blur-[8px] rounded-full animate-pulse z-25 flex items-center justify-center">
              <div className="w-24 h-4 bg-white/20 blur-[4px] rounded-full animate-bounce" />
            </div>
            
            {/* Small icon in water center */}
            <div className="absolute top-[40%] text-cyan-300 animate-pulse z-30">
              <Droplets className="w-6 h-6 animate-bounce" />
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4 max-w-sm">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
              <Trees className="w-3 h-3" /> Entering Sanctuary
            </div>
            
            <h2 className="text-xl font-bold font-title text-emerald-100 tracking-wider">
              AURA ECO SYSTEMS
            </h2>

            <p className="text-xs text-emerald-300/70 font-light italic h-4">
              {status}
            </p>

            {/* Progress metrics */}
            <div className="pt-4 space-y-1">
              <div className="w-48 bg-emerald-950 h-1 rounded-full overflow-hidden mx-auto border border-emerald-900/30">
                <div
                  className="bg-emerald-400 h-full transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold font-mono text-emerald-400/80">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
