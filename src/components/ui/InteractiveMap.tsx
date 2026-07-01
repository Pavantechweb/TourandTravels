"use client";

import React, { useState } from "react";
import { useTravel, Destination } from "@/context/TravelContext";
import { MapPin, Star, Compass, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InteractiveMap() {
  const { destinations, updateSearchFilters } = useTravel();
  const [hoveredDest, setHoveredDest] = useState<Destination | null>(null);

  const handlePinClick = (dest: Destination) => {
    updateSearchFilters({ destination: dest.name });
    
    // Scroll down to the packages grid
    const target = document.getElementById("packages");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-bold tracking-widest text-forest dark:text-emerald-400 uppercase">
          Ecosystem Grid Map
        </span>
        <h2 className="text-3xl md:text-5xl font-title font-bold text-foreground mt-2">
          Interactive <span className="text-gradient-forest">Sanctuary Map</span>
        </h2>
        <p className="text-xs md:text-sm text-foreground/75 dark:text-emerald-100/60 max-w-lg mx-auto mt-4 font-light leading-relaxed">
          Hover over coordinate coordinates to inspect real-time ratings, click to filter packages instantly.
        </p>
      </div>

      {/* Map Canvas Wrapper */}
      <div className="relative w-full aspect-[2/1] min-h-[300px] max-h-[500px] glass-panel rounded-[40px] border border-foreground/10 overflow-hidden shadow-2xl bg-[#e0f2f1]/20 dark:bg-[#060e0a]/20">
        
        {/* Stylized SVG contour lines representing earth */}
        <svg className="absolute inset-0 w-full h-full text-forest/[0.04] dark:text-emerald-400/[0.04] pointer-events-none select-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <circle cx="20" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
          <circle cx="20" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="0.2" />
          <circle cx="80" cy="70" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.1" />
          {/* Latitude lines */}
          <line x1="0" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="0.1" />
          <line x1="0" y1="70" x2="100" y2="70" stroke="currentColor" strokeWidth="0.1" />
          {/* Faint continents shapes */}
          <path d="M10,20 Q15,10 30,15 T50,30 T25,60 Z" fill="currentColor" opacity="0.4" />
          <path d="M60,40 Q75,30 85,55 T70,85 T60,65 Z" fill="currentColor" opacity="0.4" />
        </svg>

        {/* Floating Compass Rose */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2 select-none opacity-45 text-foreground">
          <Compass className="w-8 h-8 animate-[spin_20s_linear_infinite]" />
          <span className="text-[10px] uppercase font-bold tracking-widest font-mono">GRID N.100</span>
        </div>

        {/* Plotting Pins */}
        {destinations.map((dest) => {
          const isHovered = hoveredDest?.id === dest.id;

          return (
            <div
              key={dest.id}
              className="absolute"
              style={{ left: `${dest.coordinates.x}%`, top: `${dest.coordinates.y}%` }}
            >
              {/* Glowing Pulse Pin */}
              <button
                onClick={() => handlePinClick(dest)}
                onMouseEnter={() => setHoveredDest(dest)}
                onMouseLeave={() => setHoveredDest(null)}
                className="relative -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none flex items-center justify-center"
              >
                {/* Ping rings */}
                <span className="absolute w-6 h-6 rounded-full bg-forest dark:bg-emerald-400 opacity-25 group-hover:scale-150 animate-ping transition-transform duration-300" />
                <span className="absolute w-4 h-4 rounded-full bg-forest dark:bg-emerald-400 opacity-40 animate-pulse" />
                
                {/* Small Center Pin */}
                <div className="w-3 h-3 rounded-full bg-forest dark:bg-emerald-400 border border-white dark:border-[#060e0a] relative flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform duration-300">
                  <MapPin className="w-1.5 h-1.5 text-white" />
                </div>
              </button>

              {/* Hover Detail Card Popover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -65, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute z-30 left-0 -translate-x-1/2 w-48 p-3 rounded-2xl glass-panel bg-white/95 dark:bg-[#060e0a]/95 text-foreground shadow-2xl border text-xs flex items-center gap-3 select-none pointer-events-none"
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-10 h-10 rounded-lg object-cover border"
                    />
                    <div className="space-y-0.5">
                      <span className="block font-bold leading-tight">{dest.name}</span>
                      <span className="block text-[9px] text-foreground/60">{dest.country}</span>
                      <div className="flex items-center gap-0.5 text-yellow-500 font-bold text-[9px] mt-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>{dest.rating}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
