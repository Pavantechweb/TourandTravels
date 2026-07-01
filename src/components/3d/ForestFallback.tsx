"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ForestFallback() {
  const { theme } = useTheme();

  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-b from-[#e0f2f1] to-[#80cbc4] dark:from-[#05110a] dark:to-[#081a10] overflow-hidden transition-colors duration-500">
      
      {/* 1. Rising Sun / Glowing Moon */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[8px] opacity-75 bg-[#ffb74d] dark:bg-[#1a3822] transition-colors duration-500" />

      {/* 2. Drifting SVG Clouds */}
      <div className="absolute top-[10%] w-[200%] h-32 opacity-40 animate-cloud-drift flex justify-around">
        <svg width="120" height="40" viewBox="0 0 120 40" fill="currentColor" className="text-white">
          <path d="M20 30h80a15 15 0 000-30 14 14 0 00-24-6 18 18 0 00-36 6 15 15 0 00-20 30z" />
        </svg>
        <svg width="160" height="50" viewBox="0 0 160 50" fill="currentColor" className="text-white">
          <path d="M25 40h110a20 20 0 000-40 19 19 0 00-33-8 24 24 0 00-48 8 20 20 0 00-29 40z" />
        </svg>
      </div>

      {/* 3. Distant Mountains (SVG layers) */}
      <div className="absolute bottom-0 w-full h-[55%] flex items-end">
        <svg className="w-full h-full text-[#4db6ac] dark:text-[#0b2114] opacity-50 transition-colors duration-500" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,224L180,96L360,256L540,160L720,288L900,128L1080,224L1260,96L1440,256L1440,320L1260,320L1080,320L900,320L720,320L540,320L360,320L180,320L0,320Z" />
        </svg>
      </div>

      {/* 4. Midground Mountains & Waterfall ledge */}
      <div className="absolute bottom-0 w-full h-[40%] flex items-end">
        <svg className="w-full h-full text-[#009688] dark:text-[#092b17] opacity-75 transition-colors duration-500" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,192L240,288L480,160L720,224L960,128L1200,256L1440,192L1440,320L1200,320L960,320L720,320L480,320L240,320L0,320Z" />
        </svg>
      </div>

      {/* 5. Flowing Waterfall Ledge (Center) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[35%] overflow-hidden bg-[#2e7d32]/80 dark:bg-[#071f11]/80 rounded-t-lg">
        {/* Falling Water */}
        <div className="absolute inset-x-4 top-4 bottom-0 animate-water-flow rounded-t" />
        {/* Splash Mist effect at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-white/40 dark:bg-teal-500/20 blur-[4px] animate-pulse" />
      </div>

      {/* 6. Foreground Forest Silhouettes */}
      <div className="absolute bottom-0 w-full h-[28%] flex justify-between items-end px-2 select-none pointer-events-none text-[#2e7d32] dark:text-[#041a0d] transition-colors duration-500">
        {/* Left Tree Group */}
        <div className="flex items-end space-x-[-15px] sm:space-x-[-30px]">
          <svg className="w-20 h-40 animate-sway" viewBox="0 0 50 100" fill="currentColor">
            <path d="M25 10 L45 50 L38 50 L47 75 L33 75 L49 95 L1 95 L17 75 L3 75 L12 50 L5 50 Z" />
            <rect x="23" y="95" width="4" height="5" fill="#3e2723" />
          </svg>
          <svg className="w-28 h-56 animate-sway [animation-delay:1s]" viewBox="0 0 50 100" fill="currentColor">
            <path d="M25 10 L45 50 L38 50 L47 75 L33 75 L49 95 L1 95 L17 75 L3 75 L12 50 L5 50 Z" />
            <rect x="23" y="95" width="4" height="5" fill="#3e2723" />
          </svg>
        </div>

        {/* Right Tree Group */}
        <div className="flex items-end space-x-[-15px] sm:space-x-[-30px] flex-row-reverse">
          <svg className="w-20 h-40 animate-sway [animation-delay:0.5s]" viewBox="0 0 50 100" fill="currentColor">
            <path d="M25 10 L45 50 L38 50 L47 75 L33 75 L49 95 L1 95 L17 75 L3 75 L12 50 L5 50 Z" />
            <rect x="23" y="95" width="4" height="5" fill="#3e2723" />
          </svg>
          <svg className="w-28 h-56 animate-sway [animation-delay:1.5s]" viewBox="0 0 50 100" fill="currentColor">
            <path d="M25 10 L45 50 L38 50 L47 75 L33 75 L49 95 L1 95 L17 75 L3 75 L12 50 L5 50 Z" />
            <rect x="23" y="95" width="4" height="5" fill="#3e2723" />
          </svg>
        </div>
      </div>

      {/* 7. Falling Leaves (CSS animated) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="leaf-particle absolute top-[-5%] left-[20%] w-3 h-4 bg-emerald-400/50 dark:bg-emerald-600/40 rounded-tr-[50%] rounded-bl-[50%] animate-leaf-fall-1" />
        <div className="leaf-particle absolute top-[-5%] left-[50%] w-2 h-3 bg-green-400/40 dark:bg-green-500/30 rounded-tr-[50%] rounded-bl-[50%] animate-leaf-fall-2" />
        <div className="leaf-particle absolute top-[-5%] left-[80%] w-3.5 h-4.5 bg-teal-400/50 dark:bg-teal-700/40 rounded-tr-[50%] rounded-bl-[50%] animate-leaf-fall-3" />
      </div>
    </div>
  );
}
