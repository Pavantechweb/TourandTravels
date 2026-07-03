"use client";

import React, { useState } from "react";
import { useTravel } from "@/context/TravelContext";
import { Search, MapPin, Calendar, Users, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const { destinations, updateSearchFilters, searchFilters } = useTravel();
  const [dest, setDest] = useState(searchFilters.destination);
  const [dates, setDates] = useState(searchFilters.dates);
  const [travelers, setTravelers] = useState(searchFilters.travelers);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchFilters({
      destination: dest,
      dates: dates,
      travelers: Number(travelers),
    });
    
    // Scroll smoothly to the featured packages section
    const target = document.getElementById("packages");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 md:px-8 max-w-7xl mx-auto py-12">
      {/* Title & Slogan */}
      <div className="max-w-4xl mx-auto mb-10 mt-16 md:mt-24 select-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-emerald-500/20 px-4 py-1.5 rounded-full border border-emerald-500/30 mb-6 drop-shadow-md"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold tracking-widest text-emerald-300 uppercase">
            Luxury Eco-Tourism Evolved
          </span>
        </motion.div>
 
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-8xl font-title font-bold tracking-tight leading-tight md:leading-none text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
        >
          Discover Your <br />
          <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Next Adventure
          </span>
        </motion.h1>
 
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="text-base sm:text-lg md:text-xl text-zinc-100/90 max-w-2xl mx-auto mt-6 font-light leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          Find the best tours and travel packages for your dream destinations, ensuring unforgettable experiences.
        </motion.p>
      </div>

      {/* Glassmorphic Search Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="w-full max-w-5xl mx-auto"
      >
        <form
          onSubmit={handleSearch}
          className="glass-panel rounded-3xl md:rounded-full p-4 md:p-3 flex flex-col md:flex-row items-center gap-4 shadow-2xl"
        >
          {/* Destination field */}
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-foreground/10">
            <MapPin className="w-5 h-5 text-forest dark:text-emerald-400 shrink-0" />
            <div className="w-full text-left">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-foreground/60">
                Destination
              </label>
              <select
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold focus:outline-none border-none p-0 cursor-pointer text-foreground appearance-none"
              >
                <option value="" className="dark:bg-[#060e0a]">Where are you going?</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.name} className="dark:bg-[#060e0a]">
                    {d.name}, {d.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates field */}
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-foreground/10">
            <Calendar className="w-5 h-5 text-forest dark:text-emerald-400 shrink-0" />
            <div className="w-full text-left">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-foreground/60">
                Departure Date
              </label>
              <input
                type="date"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold focus:outline-none border-none p-0 cursor-pointer text-foreground dark:[color-scheme:dark]"
              />
            </div>
          </div>

          {/* Travelers field */}
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-2">
            <Users className="w-5 h-5 text-forest dark:text-emerald-400 shrink-0" />
            <div className="w-full text-left">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-foreground/60">
                Travelers
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold focus:outline-none border-none p-0 text-foreground"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </form>
      </motion.div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-6 flex flex-col items-center gap-2 animate-bounce cursor-pointer select-none">
        <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">
          Scroll to explore
        </span>
        <ArrowDown className="w-4 h-4 text-forest dark:text-emerald-400" />
      </div>
    </section>
  );
}
