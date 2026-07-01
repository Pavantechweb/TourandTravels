"use client";

import React, { useState } from "react";
import { Compass, Waves, Tent, Trees, Wind } from "lucide-react";
import { motion } from "framer-motion";

interface CategoriesProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export default function Categories({ activeCategory, setActiveCategory }: CategoriesProps) {
  const categories = [
    { id: "all", label: "All Adventures", icon: Compass, color: "from-emerald-500/10 to-teal-500/10" },
    { id: "Forest", label: "Forest Trekking", icon: Trees, color: "from-green-500/10 to-emerald-700/10" },
    { id: "Waterfall", label: "Waterfalls", icon: Waves, color: "from-cyan-500/10 to-blue-500/10" },
    { id: "Mountain", label: "Mountain Climbing", icon: Wind, color: "from-sky-500/10 to-indigo-500/10" },
    { id: "River", label: "River Rafting", icon: Waves, color: "from-teal-400/10 to-cyan-600/10" },
    { id: "Adventure", label: "Eco Safaris", icon: Tent, color: "from-amber-500/10 to-orange-600/10" },
  ];

  return (
    <section id="categories" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-title font-bold text-foreground">
          Choose Your <span className="text-gradient-forest">Adventure Style</span>
        </h2>
        <p className="text-foreground/75 dark:text-emerald-100/60 max-w-xl mx-auto mt-4 font-light">
          Whether you seek quiet meditation in mist-filled valleys or high-altitude paragliding above pine forests.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-6 rounded-3xl text-center flex flex-col items-center justify-center gap-4 transition-all duration-300 group cursor-pointer ${
                isActive
                  ? "bg-forest text-white shadow-xl scale-105"
                  : "glass-panel text-foreground hover:scale-102 hover:border-forest/40 dark:hover:border-emerald-400/40"
              }`}
            >
              {/* Icon Container */}
              <div className={`p-4 rounded-full transition-all duration-300 ${
                isActive 
                  ? "bg-white/20 text-white" 
                  : "bg-forest/5 dark:bg-emerald-400/5 group-hover:bg-forest/10 dark:group-hover:bg-emerald-400/10"
              }`}>
                <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:rotate-12 ${
                  isActive ? "text-white" : "text-forest dark:text-emerald-400"
                }`} />
              </div>

              {/* Label */}
              <span className="text-sm font-semibold tracking-wide">
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
