"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useTravel } from "@/context/TravelContext";
import { Sun, Moon, Heart, Calendar, Menu, X, User, LogOut, Globe } from "lucide-react";

interface NavbarProps {
  onOpenPlanner: () => void;
  onOpenBookings: () => void;
  onOpenAuth: () => void;
}

export default function Navbar({ onOpenPlanner, onOpenBookings, onOpenAuth }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { wishlist, bookings, isLoggedIn, user, logout, language, setLanguage } = useTravel();
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Destinations", href: "#destinations" },
    { label: "Packages", href: "#packages" },
    { label: "Planner", href: "#planner", onClick: onOpenPlanner },
    { label: "Gallery", href: "#gallery" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ];

  const handleLangChange = (lang: "en" | "es" | "fr" | "jp") => {
    setLanguage(lang);
    setShowLanguages(false);
  };

  const getLanguageLabel = () => {
    switch (language) {
      case "es": return "ES";
      case "fr": return "FR";
      case "jp": return "JP";
      default: return "EN";
    }
  };

  return (
    <header className="sticky top-4 z-50 w-full max-w-7xl mx-auto px-4 md:px-8">
      <nav className="glass-panel rounded-full py-3 px-6 md:px-8 flex items-center justify-between transition-all duration-300">
        
        {/* Logo */}
        <a href="#home" className="flex items-center space-x-2">
          <span className="text-xl md:text-2xl font-title font-bold tracking-wider text-forest dark:text-emerald-400">
            AURA<span className="text-foreground font-light">TRAVEL</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={item.onClick}
              className="text-sm font-medium text-foreground/80 hover:text-forest dark:hover:text-emerald-400 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right side controls */}
        <div className="hidden lg:flex items-center space-x-4">
          
          {/* Wishlist Icon */}
          <a href="#packages" className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <Heart className="w-5 h-5 text-foreground/85" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </a>

          {/* Bookings Cart Icon */}
          <button 
            onClick={onOpenBookings}
            className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Active bookings"
          >
            <Calendar className="w-5 h-5 text-foreground/85" />
            {bookings.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {bookings.length}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1 text-sm font-semibold"
            >
              <Globe className="w-5 h-5" />
              <span>{getLanguageLabel()}</span>
            </button>
            {showLanguages && (
              <div className="absolute right-0 mt-2 py-2 w-32 glass-panel rounded-xl shadow-xl border overflow-hidden">
                {(["en", "es", "fr", "jp"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLangChange(lang)}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-forest/10 dark:hover:bg-emerald-500/10 transition-colors ${
                      language === lang ? "text-forest dark:text-emerald-400" : "text-foreground"
                    }`}
                  >
                    {lang === "en" && "English (EN)"}
                    {lang === "es" && "Español (ES)"}
                    {lang === "fr" && "Français (FR)"}
                    {lang === "jp" && "日本語 (JP)"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          </button>

          {/* Auth Button */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-3 bg-forest/10 dark:bg-emerald-500/10 py-1.5 pl-3 pr-4 rounded-full border border-forest/20 dark:border-emerald-500/20">
              <User className="w-4 h-4 text-forest dark:text-emerald-400" />
              <span className="text-xs font-semibold max-w-[80px] truncate">{user?.name}</span>
              <button onClick={logout} className="hover:text-red-500 transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 text-sm font-semibold hover:text-forest dark:hover:text-emerald-400 transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Login</span>
            </button>
          )}

          {/* CTA Book Now */}
          <button
            onClick={onOpenPlanner}
            className="px-6 py-2 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-full text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105"
          >
            Book Now
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-3 lg:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden mt-2 p-6 glass-panel rounded-3xl flex flex-col space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                setIsOpen(false);
                if (item.onClick) item.onClick();
              }}
              className="text-lg font-semibold text-foreground py-2 border-b border-black/5 dark:border-white/5 hover:text-forest dark:hover:text-emerald-400 transition-colors"
            >
              {item.label}
            </a>
          ))}

          {/* Icons & controls in drawer */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBookings();
              }}
              className="flex items-center space-x-2 text-sm font-medium"
            >
              <Calendar className="w-5 h-5 text-forest dark:text-emerald-400" />
              <span>Bookings ({bookings.length})</span>
            </button>
            
            <a
              href="#packages"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 text-sm font-medium"
            >
              <Heart className="w-5 h-5 text-red-500" />
              <span>Wishlist ({wishlist.length})</span>
            </a>
          </div>

          <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-4">
            {isLoggedIn ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-forest dark:text-emerald-400" />
                  <span className="text-sm font-semibold">{user?.name}</span>
                </div>
                <button onClick={() => { setIsOpen(false); logout(); }} className="text-red-500 text-sm font-semibold flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth();
                }}
                className="w-full text-center py-2 border border-forest/30 dark:border-emerald-500/30 rounded-xl text-sm font-semibold"
              >
                Sign In
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenPlanner();
            }}
            className="w-full text-center py-3 bg-forest dark:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg"
          >
            Plan My Trip (AI)
          </button>
        </div>
      )}
    </header>
  );
}
