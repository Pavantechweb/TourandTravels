"use client";

import React, { useState } from "react";
import { useTravel } from "@/context/TravelContext";
import { Star, ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Destinations() {
  const { destinations } = useTravel();
  const [tilts, setTilts] = useState<{ [key: string]: { x: number; y: number } }>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max tilt angles: 12 degrees
    const rotateX = ((centerY - y) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setTilts((prev) => ({
      ...prev,
      [id]: { x: rotateX, y: rotateY },
    }));
  };

  const handleMouseLeave = (id: string) => {
    setTilts((prev) => ({
      ...prev,
      [id]: { x: 0, y: 0 },
    }));
  };

  return (
    <section id="destinations" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div className="text-left">
          <span className="text-xs font-bold tracking-widest text-forest dark:text-emerald-400 uppercase">
            Curated Sanctuary Retreats
          </span>
          <h2 className="text-3xl md:text-5xl font-title font-bold text-foreground mt-2">
            Popular <span className="text-gradient-forest">Destinations</span>
          </h2>
        </div>
        <p className="text-foreground/70 dark:text-emerald-100/60 max-w-md mt-4 md:mt-0 font-light">
          Step into protected ecological havens around the globe. Curated specifically for minimal footprint and maximum sensory rejuvenation.
        </p>
      </div>

      {/* Grid of 3D Tilt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((dest, idx) => {
          const tilt = tilts[dest.id] || { x: 0, y: 0 };

          return (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              style={{ perspective: 1000 }}
              className="w-full h-[450px]"
            >
              <div
                onMouseMove={(e) => handleMouseMove(e, dest.id)}
                onMouseLeave={() => handleMouseLeave(dest.id)}
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`,
                  transition: "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)",
                  transformStyle: "preserve-3d",
                }}
                className="w-full h-full rounded-[32px] overflow-hidden glass-panel relative group shadow-2xl cursor-pointer"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105 group-hover:scale-110"
                  style={{ backgroundImage: `url(${dest.image})` }}
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Glass Tag Category */}
                <div 
                  style={{ transform: "translateZ(30px)" }}
                  className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white tracking-wide"
                >
                  {dest.category}
                </div>

                {/* Rating Card */}
                <div 
                  style={{ transform: "translateZ(30px)" }}
                  className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 flex items-center gap-1 text-xs text-yellow-400 font-bold"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{dest.rating}</span>
                </div>

                {/* Bottom Content Card */}
                <div 
                  style={{ transform: "translateZ(40px)" }}
                  className="absolute bottom-0 inset-x-0 p-8 text-white"
                >
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{dest.country}</span>
                  </div>

                  <h3 className="text-2xl font-title font-bold leading-tight mb-2">
                    {dest.name}
                  </h3>

                  <p className="text-sm text-gray-200/85 font-light leading-relaxed line-clamp-2 mb-6">
                    {dest.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      EXPLORE PACKAGES
                    </span>
                    <div className="p-3 rounded-full bg-white/15 backdrop-blur-md border border-white/25 group-hover:bg-forest group-hover:border-forest transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
