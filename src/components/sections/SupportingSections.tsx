"use client";

import React, { useState } from "react";
import { useTravel, Blog } from "@/context/TravelContext";
import { Shield, Leaf, Heart, Users, Star, ArrowRight, Trees, Sparkles, Send } from "lucide-react";
import { motion } from "framer-motion";

// ==========================================
// 1. WHY CHOOSE US
// ==========================================
export function WhyChooseUs() {
  const points = [
    {
      icon: Leaf,
      title: "100% Carbon-Neutral",
      desc: "Every single booking offsets double its carbon output through verified local forest reforestation partnerships.",
    },
    {
      icon: Shield,
      title: "Zero-Trace Lodges",
      desc: "Stay in luxury treehouses and floating glass cabins constructed completely out of local, zero-footprint materials.",
    },
    {
      icon: Trees,
      title: "Guided Wilderness Safaris",
      desc: "Our certified local botanists and explorers guide you safely through paths keeping local wildlife completely undisturbed.",
    },
    {
      icon: Sparkles,
      title: "AI Personal Itineraries",
      desc: "Tailor your dates, styles, and group size using our custom-tuned local weather AI travel advisor.",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto bg-black/5 dark:bg-white/5 rounded-[40px] border border-foreground/5 my-12">
      <div className="text-center mb-16">
        <span className="text-xs font-bold tracking-widest text-forest dark:text-emerald-400 uppercase">
          ECOLOGICAL STANDARDS
        </span>
        <h2 className="text-3xl md:text-5xl font-title font-bold text-foreground mt-2">
          Why Travel With <span className="text-gradient-forest">Aura Travel?</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {points.map((pt, idx) => {
          const Icon = pt.icon;
          return (
            <motion.div
              key={pt.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 glass-panel rounded-3xl border border-foreground/5 hover:border-forest/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-forest/10 dark:bg-emerald-500/10 flex items-center justify-center text-forest dark:text-emerald-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold font-title text-foreground">{pt.title}</h4>
                <p className="text-xs text-foreground/75 dark:text-emerald-100/60 font-light leading-relaxed">{pt.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ==========================================
// 2. TRAVEL GALLERY (Masonry Grid)
// ==========================================
export function TravelGallery() {
  const images = [
    { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", span: "md:col-span-2 md:row-span-1", caption: "Sunset Coast Eco-lodging" },
    { url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80", span: "md:col-span-1 md:row-span-2", caption: "Deep Forest Trails" },
    { url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80", span: "md:col-span-1 md:row-span-1", caption: "Jungle Canopy Canopy Walk" },
    { url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80", span: "md:col-span-2 md:row-span-2", caption: "Plitvice Waterfalls" },
    { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", span: "md:col-span-1 md:row-span-1", caption: "Alpine Valley Sunrises" },
  ];

  return (
    <section id="gallery" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-bold tracking-widest text-forest dark:text-emerald-400 uppercase">
          Client Visual Diaries
        </span>
        <h2 className="text-3xl md:text-5xl font-title font-bold text-foreground mt-2">
          Nature <span className="text-gradient-forest">Gallery</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className={`rounded-3xl overflow-hidden glass-panel border relative group ${img.span}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-108"
              style={{ backgroundImage: `url(${img.url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-6 left-6 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350 z-10">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">Sanctuary Capture</span>
              <h4 className="text-lg font-title font-semibold mt-1">{img.caption}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ==========================================
// 3. CUSTOMER TESTIMONIALS
// ==========================================
export function Testimonials() {
  const reviews = [
    {
      name: "Marcus Aurelius",
      title: "Eco-Philosophy Scholar",
      review: "Sleeping in the glass dome treehouse in Kyoto was transformative. Waking up to morning mist swaying through the bamboo canopy is something I'll carry forever.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Sarah Jenkins",
      title: "Wildlife Photographer",
      review: "The Amazon Canopy tour with Mateo was breathtaking. Not only did I capture stunning jaguar files, but knowing the entire trip was carbon-negative made it a guilt-free luxury.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-bold tracking-widest text-forest dark:text-emerald-400 uppercase">
          Heartfelt Journeys
        </span>
        <h2 className="text-3xl md:text-5xl font-title font-bold text-foreground mt-2">
          Testimonials from <span className="text-gradient-forest">Forest Wanders</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {reviews.map((rv, idx) => (
          <motion.div
            key={rv.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="p-8 glass-panel rounded-[36px] flex flex-col justify-between space-y-6 shadow-lg border"
          >
            <p className="italic text-foreground/80 dark:text-emerald-100/70 font-light leading-relaxed text-sm">
              "{rv.review}"
            </p>

            <div className="flex items-center gap-4">
              <img
                src={rv.avatar}
                alt={rv.name}
                className="w-12 h-12 rounded-full border border-forest/20 object-cover"
              />
              <div>
                <h4 className="font-bold text-sm text-foreground">{rv.name}</h4>
                <span className="text-[10px] text-foreground/60">{rv.title}</span>
                <div className="flex items-center gap-0.5 text-yellow-400 mt-1">
                  {[...Array(rv.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ==========================================
// 4. LATEST BLOGS
// ==========================================
export function LatestBlogs() {
  const { blogs } = useTravel();

  return (
    <section id="blog" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div className="text-left">
          <span className="text-xs font-bold tracking-widest text-forest dark:text-emerald-400 uppercase">
            Travel Journals
          </span>
          <h2 className="text-3xl md:text-5xl font-title font-bold text-foreground mt-2">
            Latest from <span className="text-gradient-forest">The Forest Blog</span>
          </h2>
        </div>
        <p className="text-foreground/70 dark:text-emerald-100/60 max-w-sm mt-4 md:mt-0 font-light text-sm">
          Eco-advocacy guides, wildlife photography hacks, and guides to understanding the silent power of ancient woodlands.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map((bg, idx) => (
          <motion.article
            key={bg.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="glass-panel rounded-3xl overflow-hidden border flex flex-col justify-between hover:shadow-xl group transition-all"
          >
            <div>
              {/* Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={bg.image}
                  alt={bg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Body */}
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-bold text-forest dark:text-emerald-400 uppercase">
                  {bg.date} • {bg.readTime}
                </span>
                <h4 className="text-lg font-bold font-title leading-snug text-foreground group-hover:text-forest dark:group-hover:text-emerald-400 transition-colors">
                  {bg.title}
                </h4>
                <p className="text-xs text-foreground/75 dark:text-emerald-100/65 font-light leading-relaxed line-clamp-2">
                  {bg.excerpt}
                </p>
              </div>
            </div>

            {/* Author card */}
            <div className="p-6 pt-0 border-t border-foreground/5 mt-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground/60">By {bg.author}</span>
              <button className="text-xs font-bold text-forest dark:text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer">
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

// ==========================================
// 5. FOOTER & NEWSLETTER
// ==========================================
export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer id="contact" className="bg-black/10 dark:bg-black/60 border-t border-foreground/10 pt-20 pb-8 px-4 md:px-8 max-w-7xl mx-auto rounded-t-[50px]">
      
      {/* Newsletter Block */}
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
        <span className="text-xs font-bold tracking-widest text-forest dark:text-emerald-400 uppercase">
          Eco-Alliance Newsletter
        </span>
        <h3 className="text-2xl md:text-4xl font-title font-bold text-foreground">
          Subscribe to the Forest Whispers
        </h3>
        <p className="text-xs md:text-sm text-foreground/75 dark:text-emerald-100/60 max-w-md mx-auto font-light leading-relaxed">
          Receive seasonal itinerary recommendations, carbon project audit reports, and exclusive discounts for active members.
        </p>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-3 p-1.5 glass-panel rounded-full border border-foreground/10 shadow-lg">
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent px-4 py-2.5 text-xs text-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-forest dark:bg-emerald-500 hover:bg-forest-light dark:hover:bg-emerald-600 text-white rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>{subscribed ? "Subscribed!" : "Subscribe"}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Directory Columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-foreground/5 pt-12 mb-12 text-sm">
        <div className="space-y-4">
          <h4 className="font-bold text-forest dark:text-emerald-400 font-title uppercase tracking-wider text-xs">
            Aura Travel
          </h4>
          <p className="text-xs text-foreground/60 leading-relaxed font-light">
            Luxury ecological adventures engineered to offset double the footprint. Rest in peace.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-foreground font-title uppercase tracking-wider text-xs">Sanctuaries</h4>
          <ul className="space-y-1.5 text-xs text-foreground/70 font-light">
            <li><a href="#destinations" className="hover:text-forest transition-colors">Kyoto Forests</a></li>
            <li><a href="#destinations" className="hover:text-forest transition-colors">Croatia Lakes</a></li>
            <li><a href="#destinations" className="hover:text-forest transition-colors">Swiss Alps Valleys</a></li>
            <li><a href="#destinations" className="hover:text-forest transition-colors">Amazon Canopy</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-foreground font-title uppercase tracking-wider text-xs">Company</h4>
          <ul className="space-y-1.5 text-xs text-foreground/70 font-light">
            <li><a href="#about" className="hover:text-forest transition-colors">Eco Pledge</a></li>
            <li><a href="#blog" className="hover:text-forest transition-colors">Journals</a></li>
            <li><a href="#gallery" className="hover:text-forest transition-colors">Client Diaries</a></li>
            <li><a href="#contact" className="hover:text-forest transition-colors">Support Channels</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-foreground font-title uppercase tracking-wider text-xs">Legal</h4>
          <ul className="space-y-1.5 text-xs text-foreground/70 font-light">
            <li><a href="#privacy" className="hover:text-forest transition-colors">Carbon Audit Reports</a></li>
            <li><a href="#terms" className="hover:text-forest transition-colors">Zero-Trace Standards</a></li>
            <li><a href="#policy" className="hover:text-forest transition-colors">Sandbox Privacy</a></li>
          </ul>
        </div>
      </div>

      {/* Copy row */}
      <div className="border-t border-foreground/5 pt-8 text-center text-[10px] text-foreground/55 font-light">
        <p>© {new Date().getFullYear()} Aura Travel Inc. All carbon offsets verified under Local Forest Ledger 2026. Made with peaceful guidelines.</p>
      </div>
    </footer>
  );
}
