"use client";

import React, { useState } from "react";
import { Compass, Calendar, Settings, Sparkles, Footprints, AlertCircle, ArrowRight, ArrowLeft, Leaf, MapPin, Coffee, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface TripPlannerProps {
  onClose?: () => void;
  onBookFromPlanner?: (packageName: string, price: number, days: number) => void;
}

export default function TripPlanner({ onClose, onBookFromPlanner }: TripPlannerProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // User input states
  const [destination, setDestination] = useState("Kyoto Bamboo Forest");
  const [style, setStyle] = useState("Eco-Immersion");
  const [budget, setBudget] = useState("Ultra-Luxury");
  const [days, setDays] = useState(4);
  const [group, setGroup] = useState("Couple");

  // Output State
  const [itinerary, setItinerary] = useState<any[] | null>(null);

  const startGenerating = () => {
    setLoading(true);
    setStep(3);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            generateItinerary();
          }, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const generateItinerary = () => {
    // Generate tailored itineraries based on user inputs
    let generated: any[] = [];
    for (let d = 1; d <= days; d++) {
      let title = "";
      let desc = "";
      let activity = "";
      let accommodation = "";
      let food = "";

      if (destination.includes("Kyoto")) {
        if (d === 1) {
          title = "Misty Arrival & Canopy Lodge Welcome";
          desc = "Land at the airport and transfer via luxury electric Tesla shuttle. Enter the whispering bamboo forest and settle into your glass canopy treehouse.";
          activity = "Sunset meditation walk";
          accommodation = "Aura Glass Treehouse Sages";
          food = "Traditional Shojin Ryori (Buddhist Vegetarian Banquet)";
        } else if (d === days) {
          title = "Onsen Serenity & Farewell Ceremony";
          desc = "A peaceful morning soaking in therapeutic thermal springs. Conclude your carbon-neutral pilgrimage with an organic tea whisking ceremony.";
          activity = "Traditional green tea harvest";
          accommodation = "Aura Glass Treehouse Sages";
          food = "Matcha-infused delicacies and luxury bento boxes";
        } else {
          title = `Day ${d}: Zen Exploration & ${style}`;
          desc = `Delve deeper into forest tranquility. Take a private walking tour of moss gardens, participate in a silent temple hike, and experience ${style.toLowerCase()} workshops.`;
          activity = style === "Eco-Immersion" ? "Reforestation seed-planting" : "Sound-bath meditation";
          accommodation = "Aura Glass Treehouse Sages";
          food = "Steaming bamboo shoot soup and locally-foraged mountain herbs";
        }
      } else if (destination.includes("Plitvice")) {
        if (d === 1) {
          title = "Canyon Descent & Floating Cabin Check-in";
          desc = "Travel through deep gorges to the edge of the crystal lakes. Check into your floating luxury glass cabin positioned above a rushing river.";
          activity = "Introductory kayak row";
          accommodation = "Cascading Lake Eco-Pods";
          food = "Fresh lake trout cooked with wild pine-nuts";
        } else if (d === days) {
          title = "Summit Sunset & Cave Dining Farewell";
          desc = "Climb the scenic trails to a panoramic overlook of all 16 lakes. Conclude your voyage inside a natural limestone cavern lit by candles.";
          activity = "Sunset ridge-line trek";
          accommodation = "Cascading Lake Eco-Pods";
          food = "Caviar and Mediterranean herbs cooked inside the cave";
        } else {
          title = `Day ${d}: Waterfall Navigation & ${style}`;
          desc = `Spend the day crossing hanging wood walkways, discovering hidden waterfalls, and engaging in ${style.toLowerCase()} activities under crystal clear skies.`;
          activity = style === "High Adventure" ? "Glacier river rafting" : "Wildflower photography tour";
          accommodation = "Cascading Lake Eco-Pods";
          food = "Rustic wild berry pastries and local honey cheese platters";
        }
      } else {
        // Fallback or Swiss Alps / Amazon
        if (d === 1) {
          title = "Altitude Ascent & Wilderness Lodge Welcome";
          desc = `Ascend to the panoramic valley ridges via zero-emission cablecars. Settle into your wood-crafted alpine suite overlooking mist-laden ridges.`;
          activity = "Mist-laden canopy valley walk";
          accommodation = "Summit Crest Carbon-Negative Lodge";
          food = "Organic local goat cheeses and truffle risotto";
        } else if (d === days) {
          title = "Glacier Ridge Farewell & Star Gazing";
          desc = "Celebrate your final night above the clouds. Peek through advanced telescopes at clear constellations in the unpolluted night sky.";
          activity = "Mountain paragliding descent";
          accommodation = "Summit Crest Carbon-Negative Lodge";
          food = "Warm wildflower honey wines and local forest stews";
        } else {
          title = `Day ${d}: Peak Ridge Traversal & ${style}`;
          desc = `Embark on a guided hike exploring biodiversity, alpine meadows, and testing your stamina in ${style.toLowerCase()} adventures.`;
          activity = "Private botanical cataloging";
          accommodation = "Summit Crest Carbon-Negative Lodge";
          food = "Steaming mountain herbal teas and organic barley broths";
        }
      }

      generated.push({ day: d, title, desc, activity, accommodation, food });
    }

    setItinerary(generated);
    setLoading(false);
    setStep(4);
    
    // Shoot confetti for planning success
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1B5E20", "#2E7D32", "#80deea", "#ffffff"]
    });
  };

  const getCarbonOffset = () => {
    return days * 15.4; // 15.4 kg of CO2 offset per day
  };

  const getPriceEstimate = () => {
    let multiplier = budget === "Ultra-Luxury" ? 450 : budget === "Premium" ? 320 : 600;
    return days * multiplier;
  };

  const resetPlanner = () => {
    setItinerary(null);
    setStep(1);
  };

  return (
    <div id="planner" className="w-full max-w-4xl mx-auto glass-panel rounded-[40px] p-6 md:p-10 shadow-2xl relative border overflow-hidden my-12 scroll-mt-24">
      {/* Sparkles background effect */}
      <div className="absolute top-0 right-0 p-8 text-forest/10 dark:text-emerald-400/10 pointer-events-none select-none">
        <Sparkles className="w-24 h-24" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: Core Preferences */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-left">
              <span className="text-xs font-bold tracking-widest text-forest dark:text-emerald-400 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Personal Concierge
              </span>
              <h3 className="text-2xl md:text-4xl font-title font-bold text-foreground mt-2">
                Configure Your Nature Retreat
              </h3>
              <p className="text-foreground/75 dark:text-emerald-100/60 font-light text-sm mt-1">
                Tell our planning engine your preferences to craft a personalized carbon-neutral escape.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Destination */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/60">Destination Sanctuary</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-4 rounded-2xl glass-panel bg-transparent border-foreground/15 text-sm font-semibold focus:outline-none focus:border-forest text-foreground"
                >
                  <option value="Kyoto Bamboo Forest" className="dark:bg-[#060e0a]">Kyoto Bamboo Forest, Japan</option>
                  <option value="Plitvice Lakes Waterfalls" className="dark:bg-[#060e0a]">Plitvice Lakes Waterfalls, Croatia</option>
                  <option value="Swiss Alps Valley" className="dark:bg-[#060e0a]">Swiss Alps Valley, Switzerland</option>
                  <option value="Amazon Canopy Walkway" className="dark:bg-[#060e0a]">Amazon Canopy Walkway, Brazil</option>
                </select>
              </div>

              {/* Style */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/60">Travel Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-4 rounded-2xl glass-panel bg-transparent border-foreground/15 text-sm font-semibold focus:outline-none focus:border-forest text-foreground"
                >
                  <option value="Eco-Immersion" className="dark:bg-[#060e0a]">Eco-Immersion & Wildlife</option>
                  <option value="High Adventure" className="dark:bg-[#060e0a]">High Adventure & Hikes</option>
                  <option value="Wellness & Yoga" className="dark:bg-[#060e0a]">Wellness & Yoga Retreat</option>
                  <option value="Pure Relaxation" className="dark:bg-[#060e0a]">Pure Relaxation & Mist Gazing</option>
                </select>
              </div>

              {/* Budget */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/60">Luxury Tier</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full p-4 rounded-2xl glass-panel bg-transparent border-foreground/15 text-sm font-semibold focus:outline-none focus:border-forest text-foreground"
                >
                  <option value="Premium" className="dark:bg-[#060e0a]">Premium Eco (Eco-Cabin)</option>
                  <option value="Ultra-Luxury" className="dark:bg-[#060e0a]">Ultra-Luxury (Glass Canopy Treehouse)</option>
                  <option value="Carbon-Negative Masterclass" className="dark:bg-[#060e0a]">Carbon-Negative Elite Villa</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-full font-bold shadow-md flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
              >
                <span>Next Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Journey Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-left">
              <h3 className="text-2xl md:text-3xl font-title font-bold text-foreground">
                Fine-tune Your Journey
              </h3>
              <p className="text-foreground/75 dark:text-emerald-100/60 font-light text-sm mt-1">
                Select your duration and traveler composition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Duration Slider */}
              <div className="flex flex-col gap-4 p-6 glass-panel rounded-3xl">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground/60 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-forest dark:text-emerald-400" /> Duration of Escape
                </span>
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>{days} Days</span>
                  <span className="text-xs text-foreground/60">(3 to 7 Days range)</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="7"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full h-1.5 bg-forest/20 dark:bg-emerald-400/20 rounded-lg appearance-none cursor-pointer accent-forest dark:accent-emerald-400"
                />
              </div>

              {/* Traveler Group */}
              <div className="flex flex-col gap-4 p-6 glass-panel rounded-3xl">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground/60 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-forest dark:text-emerald-400" /> Companion Configuration
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {["Solo", "Couple", "Family (Kids)", "Adventure Group"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGroup(g)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        group === g
                          ? "bg-forest border-forest text-white shadow"
                          : "border-foreground/15 text-foreground hover:bg-forest/5"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-foreground/15 rounded-full font-bold text-foreground hover:bg-forest/5 flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={startGenerating}
                className="px-8 py-3.5 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-full font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Plan</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Loading Screen */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center space-y-6"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-forest/20 dark:border-emerald-400/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-forest dark:border-t-emerald-400 animate-spin" />
              <Compass className="w-10 h-10 text-forest dark:text-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-title font-bold text-foreground animate-pulse">
                Mapping Canopy Pathways...
              </h3>
              <p className="text-xs text-foreground/75 dark:text-emerald-100/60 font-light max-w-sm">
                Generating daily schedules, picking organic meal options, and calculating eco-accommodation offsets.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-md bg-forest/10 dark:bg-emerald-400/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-forest dark:bg-emerald-400 h-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-forest dark:text-emerald-400">{progress}% Complete</span>
          </motion.div>
        )}

        {/* STEP 4: Itinerary Result */}
        {step === 4 && itinerary && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header Result Card */}
            <div className="glass-panel p-6 rounded-[28px] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-forest/20 dark:border-emerald-500/20">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-forest dark:text-emerald-400">
                  AI Plan Recommendation
                </span>
                <h4 className="text-xl md:text-2xl font-title font-bold text-foreground mt-1">
                  {days}-Day {style} Journey
                </h4>
                <p className="text-xs text-foreground/60 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-forest dark:text-emerald-400" /> {destination} • {group}
                </p>
              </div>

              {/* Eco stats */}
              <div className="flex items-center gap-4">
                <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="block text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Carbon Offset
                  </span>
                  <span className="text-sm font-extrabold text-foreground">{getCarbonOffset().toFixed(1)} kg CO₂</span>
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-forest/10 border border-forest/20 text-center">
                  <span className="block text-[9px] uppercase font-bold text-forest dark:text-emerald-300">
                    Estimated Cost
                  </span>
                  <span className="text-sm font-extrabold text-foreground">${getPriceEstimate()}</span>
                </div>
              </div>
            </div>

            {/* Daily Schedule accordion */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {itinerary.map((dayPlan, idx) => (
                <div key={dayPlan.day} className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-foreground/10 hover:border-forest/30 dark:hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-forest dark:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl font-title">
                      DAY {dayPlan.day}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold font-title text-base text-foreground">
                        {dayPlan.title}
                      </h5>
                      <p className="text-xs text-foreground/75 dark:text-emerald-100/60 font-light mt-2 leading-relaxed">
                        {dayPlan.desc}
                      </p>

                      {/* Details row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-[10px] uppercase font-semibold text-foreground/70">
                        <div className="flex items-center gap-1.5">
                          <Footprints className="w-3.5 h-3.5 text-forest dark:text-emerald-400 shrink-0" />
                          <span>{dayPlan.activity}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Coffee className="w-3.5 h-3.5 text-forest dark:text-emerald-400 shrink-0" />
                          <span>{dayPlan.accommodation}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-forest dark:text-emerald-400 shrink-0" />
                          <span>{dayPlan.food}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer row */}
            <div className="flex justify-between items-center pt-4 border-t border-foreground/10">
              <button
                onClick={resetPlanner}
                className="px-6 py-3 border border-foreground/15 rounded-full font-bold text-foreground hover:bg-forest/5 flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Configure New</span>
              </button>

              <button
                onClick={() => {
                  if (onBookFromPlanner) {
                    onBookFromPlanner(
                      `${days}-Day AI Custom ${destination}`,
                      getPriceEstimate(),
                      days
                    );
                  }
                  if (onClose) onClose();
                }}
                className="px-8 py-3.5 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-full font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
              >
                <span>Confirm & Book Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
