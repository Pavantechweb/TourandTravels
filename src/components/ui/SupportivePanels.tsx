"use client";

import React, { useState } from "react";
import { useTravel } from "@/context/TravelContext";
import { X, User, Lock, Mail, Trash2, Calendar, MapPin, MessageSquare, Send, Sparkles, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// 1. AUTH MODAL
// ==========================================
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useTravel();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      login(name, email);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative border z-10 space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-forest dark:text-emerald-400">Join Aura Alliance</span>
            <h3 className="text-xl font-bold font-title text-foreground">Sign In / Register</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-foreground/60">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <input
                type="text"
                required
                placeholder="Alex Forester"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-panel bg-transparent border-foreground/15 text-xs text-foreground focus:outline-none focus:border-forest"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-foreground/60">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <input
                type="email"
                required
                placeholder="alex@forest.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-panel bg-transparent border-foreground/15 text-xs text-foreground focus:outline-none focus:border-forest"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Authenticate Securely
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ==========================================
// 2. ACTIVE BOOKINGS MODAL (Cart)
// ==========================================
interface BookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActiveBookingsModal({ isOpen, onClose }: BookingsModalProps) {
  const { bookings, removeBooking } = useTravel();

  if (!isOpen) return null;

  const totalCost = bookings.reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel w-full max-w-lg rounded-[36px] p-6 shadow-2xl relative border z-10 max-h-[80vh] flex flex-col"
      >
        <div className="flex justify-between items-center border-b pb-4 border-foreground/10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-forest dark:text-emerald-400">Cart Ecosystem</span>
            <h3 className="text-xl md:text-2xl font-bold font-title text-foreground">Active Bookings</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar pr-1">
          {bookings.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <span className="text-sm text-foreground/60 font-light block">You have no active bookings at this time.</span>
              <span className="text-xs text-forest dark:text-emerald-400 font-semibold block">Select a featured package or use the AI Planner!</span>
            </div>
          ) : (
            bookings.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border flex justify-between items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-forest/10 dark:bg-emerald-500/10 text-forest dark:text-emerald-400">
                    {b.type}
                  </span>
                  <h4 className="font-bold text-sm text-foreground leading-tight">{b.itemName}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-foreground/60 font-light">
                    <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {b.date}</span>
                    <span>• {b.details}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm text-forest dark:text-emerald-400">${b.price.toFixed(2)}</span>
                  <button
                    onClick={() => removeBooking(b.id)}
                    className="p-2 rounded-full text-foreground/50 hover:text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer"
                    title="Cancel booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {bookings.length > 0 && (
          <div className="border-t pt-4 border-foreground/10 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold font-title">
              <span>Total Invoice</span>
              <span className="text-forest dark:text-emerald-400">${totalCost.toFixed(2)}</span>
            </div>
            
            <button
              onClick={() => alert("Simulating checkout complete! Thank you for supporting double-carbon offsets.")}
              className="w-full py-3 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Checkout Eco Ledger
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ==========================================
// 3. FLOATING CHAT SUPPORT (AI Assistant)
// ==========================================
export function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, text: "Welcome traveler. I am Aura, your forest canopy AI advisor. Ask me anything about our eco-destinations, local weather, or carbon policies!", isBot: true },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      let reply = "I am tuning into our forest coordinates to fetch this detail. For direct package bookings, please use the 'Book Now' forms on our main panel.";
      const query = input.toLowerCase();

      if (query.includes("kyoto") || query.includes("japan") || query.includes("bamboo")) {
        reply = "Kyoto Bamboo Forest is best visited at sunrise (around 5:30 AM) when the mist sits low in the canopy and wind whispers are loudest. Our zero-trace treehouses are fully booked for autumn, but summer slots remain open.";
      } else if (query.includes("weather") || query.includes("temp")) {
        reply = "Currently, Kyoto is Misty (22°C), Croatia Lakes is Sunny (24°C), and the Swiss Alps valley is Cloudy (15°C). All our tours operate in mild rain under custom leaf-canopy umbrellas.";
      } else if (query.includes("carbon") || query.includes("offset") || query.includes("eco")) {
        reply = "Every trip is 100% carbon-neutral. We track flights, lodging power, and guide transport, then purchase and plant double that quantity of local seedlings via Forest Ledger audits.";
      } else if (query.includes("croatia") || query.includes("plitvice") || query.includes("waterfall")) {
        reply = "Plitvice lakes feature 16 cascading lakes connected by crystal-clear travertine waterfalls. Wooden walkways bridge the lakes. Floating glass-edge eco-pods are available for reservation!";
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            className="glass-panel w-80 h-96 rounded-[32px] overflow-hidden shadow-2xl border flex flex-col mb-4 bg-white/95 dark:bg-[#060e0a]/95"
          >
            {/* Header */}
            <div className="p-4 bg-forest dark:bg-emerald-950 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
                <div>
                  <h4 className="font-bold text-xs leading-none">Aura Travel Assistant</h4>
                  <span className="text-[9px] opacity-75">Eco Advisory AI Active</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat message flow */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs font-light leading-relaxed">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      m.isBot
                        ? "bg-black/5 dark:bg-white/5 border text-foreground rounded-tl-none"
                        : "bg-forest text-white rounded-tr-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSend} className="p-3 border-t border-foreground/10 flex gap-2">
              <input
                type="text"
                placeholder="Ask about weather, carbon offset..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none border border-foreground/5"
              />
              <button
                type="submit"
                className="p-2 bg-forest dark:bg-emerald-500 hover:bg-forest-light text-white rounded-xl cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-108 active:scale-95 transition-all cursor-pointer"
        title="Eco advisor chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
