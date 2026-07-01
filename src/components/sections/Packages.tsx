"use client";

import React, { useMemo } from "react";
import { useTravel, Package } from "@/context/TravelContext";
import { Star, Heart, Calendar, Sun, CloudRain, Cloud, CloudFog, Compass, Thermometer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PackagesProps {
  activeCategory: string;
  onBookPackage: (pkg: Package) => void;
}

export default function Packages({ activeCategory, onBookPackage }: PackagesProps) {
  const { packages, wishlist, toggleWishlist, searchFilters } = useTravel();

  // Filter packages based on activeCategory AND hero search filters
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // 1. Category Filter
      const matchesCategory =
        activeCategory === "all" || pkg.category === activeCategory;

      // 2. Search Filter
      const matchesSearch =
        !searchFilters.destination ||
        pkg.destination.toLowerCase().includes(searchFilters.destination.toLowerCase()) ||
        pkg.title.toLowerCase().includes(searchFilters.destination.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [packages, activeCategory, searchFilters]);

  // Weather Condition Icon Mapper
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Rainy":
        return <CloudRain className="w-4 h-4 text-cyan-400" />;
      case "Misty":
        return <CloudFog className="w-4 h-4 text-teal-300" />;
      case "Cloudy":
        return <Cloud className="w-4 h-4 text-gray-300" />;
      default:
        return <Sun className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <section id="packages" className="py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div className="text-left">
          <span className="text-xs font-bold tracking-widest text-forest dark:text-emerald-400 uppercase">
            All-Inclusive Eco Packages
          </span>
          <h2 className="text-3xl md:text-5xl font-title font-bold text-foreground mt-2">
            Featured <span className="text-gradient-forest">Eco Packages</span>
          </h2>
        </div>
        
        {/* Active search filter reset warning */}
        {searchFilters.destination && (
          <div className="bg-forest/10 dark:bg-emerald-500/10 px-4 py-2 rounded-2xl border border-forest/20 mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground/80">
              Showing matches for "{searchFilters.destination}"
            </span>
          </div>
        )}
      </div>

      {/* Grid wrapper */}
      {filteredPackages.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl p-8 max-w-lg mx-auto">
          <Compass className="w-12 h-12 text-forest/40 dark:text-emerald-400/40 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-foreground">No Packages Found</h3>
          <p className="text-foreground/75 dark:text-emerald-100/60 font-light text-sm">
            Try changing your destination filter or resetting to "All Adventures" above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredPackages.map((pkg, idx) => {
              const isLiked = wishlist.includes(pkg.id);

              return (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="glass-panel rounded-[36px] overflow-hidden flex flex-col sm:flex-row shadow-xl relative hover:shadow-2xl border transition-all duration-300 group"
                >
                  {/* Photo Container */}
                  <div className="w-full sm:w-1/2 h-64 sm:h-auto min-h-[250px] relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${pkg.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/50 to-transparent" />

                    {/* Like Trigger */}
                    <button
                      onClick={() => toggleWishlist(pkg.id)}
                      className="absolute top-4 left-4 p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 transition-colors z-10 cursor-pointer"
                    >
                      <Heart 
                        className={`w-5 h-5 transition-transform active:scale-125 ${
                          isLiked ? "fill-red-500 text-red-500" : "text-white"
                        }`} 
                      />
                    </button>

                    {/* Duration Badge */}
                    <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-xs text-white font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>

                  {/* Info Container */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-forest dark:text-emerald-400">
                          {pkg.difficulty} • {pkg.category}
                        </span>
                        
                        {/* Weather Badge */}
                        <div 
                          className="px-2.5 py-1 rounded-full bg-forest/5 dark:bg-emerald-400/5 border border-forest/10 dark:border-emerald-500/10 flex items-center gap-1.5 text-[10px] font-semibold text-foreground/80"
                          title={`Weather in ${pkg.destination}`}
                        >
                          {getWeatherIcon(pkg.weather.condition)}
                          <span>{pkg.weather.temp}°C {pkg.weather.condition}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-title font-bold text-foreground mb-3 leading-tight">
                        {pkg.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs md:text-sm text-foreground/75 dark:text-emerald-100/60 font-light leading-relaxed mb-6">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div>
                      {/* Rating details */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-bold text-foreground">{pkg.rating}</span>
                        </div>
                        <span className="text-xs text-foreground/60">({pkg.reviewCount} reviews)</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-foreground/10 pt-4">
                        <div>
                          <span className="block text-[10px] uppercase font-semibold text-foreground/60">
                            Carbon-Neutral Luxury
                          </span>
                          <span className="text-xl md:text-2xl font-bold font-title text-forest dark:text-emerald-400">
                            ${pkg.price}
                            <span className="text-xs text-foreground/60 font-normal"> / person</span>
                          </span>
                        </div>

                        {/* CTA button */}
                        <button
                          onClick={() => onBookPackage(pkg)}
                          className="px-5 py-2.5 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-full text-xs font-bold shadow-md hover:scale-103 transition-all cursor-pointer"
                        >
                          Book Package
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
