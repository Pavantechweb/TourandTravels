"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import Destinations from "@/components/sections/Destinations";
import Packages from "@/components/sections/Packages";
import BookingModal from "@/components/ui/BookingModal";
import InteractiveMap from "@/components/ui/InteractiveMap";
import ForestFallback from "@/components/3d/ForestFallback";
import {
  WhyChooseUs,
  TravelGallery,
  Testimonials,
  LatestBlogs,
  Footer,
} from "@/components/sections/SupportingSections";
import {
  AuthModal,
  ActiveBookingsModal,
  ChatSupport,
} from "@/components/ui/SupportivePanels";
import TripPlanner from "@/components/planner/TripPlanner";
import { Package } from "@/context/TravelContext";
import IntroLoader from "@/components/ui/IntroLoader";

// Dynamically load the Three.js 3D forest canvas with SSR disabled to prevent server compilation errors
const ForestScene = dynamic(() => import("@/components/3d/ForestScene"), {
  ssr: false,
  loading: () => <ForestFallback />,
});

export default function Home() {
  // Intro Loader State
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  // Modal toggle states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBookingsCartOpen, setIsBookingsCartOpen] = useState(false);
  const [showPlannerSection, setShowPlannerSection] = useState(true);

  // Sorting & Selected item states
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedBookingPkg, setSelectedBookingPkg] = useState<Package | null>(null);

  const handleBookPackage = (pkg: Package) => {
    setSelectedBookingPkg(pkg);
    setIsBookingOpen(true);
  };

  const handleBookFromPlanner = (name: string, price: number, days: number) => {
    // Generate a temporary package for the booking flow
    const tempPkg: Package = {
      id: `ai-plan-${Date.now()}`,
      title: name,
      destination: "AI Custom Sanctuary",
      country: "Eco Alliance",
      description: `Custom generated ${days}-day itinerary.`,
      price: price,
      duration: `${days} Days`,
      rating: 5,
      reviewCount: 1,
      difficulty: "Easy",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      category: "Adventure",
      weather: { temp: 21, condition: "Sunny", humidity: 50 },
      highlights: [],
      itinerary: [],
    };

    setSelectedBookingPkg(tempPkg);
    setIsBookingOpen(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      
      {/* Intro Loader Splash Screen */}
      {!isIntroComplete && (
        <IntroLoader onComplete={() => setIsIntroComplete(true)} />
      )}

      {/* Cinematic Looping Video Background (Foggy Forest Canopy) */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-[#020804]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.45] dark:brightness-[0.35] contrast-[1.1] transition-all duration-700"
        >
          <source src="/website_bg.mp4" type="video/mp4" />
        </video>
        {/* Ambient overlay to protect readability */}
        <div className="absolute inset-0 bg-black/15 dark:bg-black/45 backdrop-blur-[0.5px] transition-colors duration-500" />
      </div>

      {/* Floating Header Navbar */}
      <Navbar
        onOpenPlanner={() => {
          const target = document.getElementById("planner-section");
          if (target) target.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenBookings={() => setIsBookingsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Page Layout Wrapper */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-12">
        
        {/* Hero Section */}
        <Hero />

        {/* Categories Section */}
        <Categories
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Popular 3D tilt Destinations Section */}
        <Destinations />

        {/* Featured Packages Section */}
        <Packages
          activeCategory={activeCategory}
          onBookPackage={handleBookPackage}
        />

        {/* AI Trip Planner Wizard */}
        <div id="planner-section" className="scroll-mt-24">
          <TripPlanner onBookFromPlanner={handleBookFromPlanner} />
        </div>

        {/* Why Choose Us credentials Grid */}
        <WhyChooseUs />

        {/* SVG Interactive Map coordinates */}
        <InteractiveMap />

        {/* Customer Review testimonies */}
        <Testimonials />

        {/* Media Image Gallery */}
        <TravelGallery />

        {/* Blog logs */}
        <LatestBlogs />

      </main>

      {/* Footer and newsletter */}
      <div className="relative z-10 w-full">
        <Footer />
      </div>

      {/* SUPPORTIVE DIALOG OVERLAYS */}
      
      {/* 1. Login Authentication Portal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* 2. Active Bookings Drawer */}
      <ActiveBookingsModal
        isOpen={isBookingsCartOpen}
        onClose={() => setIsBookingsCartOpen(false)}
      />

      {/* 3. Customize & secure Booking modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedBookingPkg(null);
        }}
        selectedPackage={selectedBookingPkg}
      />

      {/* 4. AI Floating Chat Support bot */}
      <ChatSupport />

    </div>
  );
}
