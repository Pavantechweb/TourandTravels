"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  category: "Forest" | "Waterfall" | "Mountain" | "River" | "Adventure";
  rating: number;
  coordinates: { x: number; y: number }; // Percentage for custom map
}

export interface Package {
  id: string;
  title: string;
  destination: string;
  country: string;
  description: string;
  price: number;
  duration: string; // e.g., "5 Days"
  rating: number;
  reviewCount: number;
  difficulty: "Easy" | "Medium" | "Challenging";
  image: string;
  category: "Forest" | "Waterfall" | "Mountain" | "River" | "Adventure";
  weather: {
    temp: number;
    condition: "Misty" | "Sunny" | "Rainy" | "Snowy" | "Cloudy";
    humidity: number;
  };
  highlights: string[];
  itinerary: { day: number; title: string; desc: string }[];
}

export interface TourGuide {
  id: string;
  name: string;
  role: string;
  rating: number;
  image: string;
  bio: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
}

export interface Booking {
  id: string;
  type: "package" | "hotel" | "activity";
  itemId: string;
  itemName: string;
  price: number;
  date: string;
  travelers: number;
  details: string;
}

type Language = "en" | "es" | "fr" | "jp";

interface SearchFilters {
  destination: string;
  dates: string;
  travelers: number;
}

interface TravelContextType {
  destinations: Destination[];
  packages: Package[];
  guides: TourGuide[];
  blogs: Blog[];
  wishlist: string[];
  bookings: Booking[];
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  language: Language;
  searchFilters: SearchFilters;
  toggleWishlist: (id: string) => void;
  addBooking: (booking: Omit<Booking, "id">) => void;
  removeBooking: (id: string) => void;
  login: (name: string, email: string) => void;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

// Rich Mock Databases
const mockDestinations: Destination[] = [
  {
    id: "dest-1",
    name: "Wayanad Bamboo Forest",
    country: "Kerala, India",
    description: "Walk through whispering green bamboo groves shrouded in dense mountain mist, leading to prehistoric caves.",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
    category: "Forest",
    rating: 4.9,
    coordinates: { x: 45, y: 70 },
  },
  {
    id: "dest-2",
    name: "Athirappilly Cascades",
    country: "Kerala, India",
    description: "Witness India's most spectacular roaring rainforest waterfall, enveloped in cloud mist and lush greenery.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    category: "Waterfall",
    rating: 4.85,
    coordinates: { x: 48, y: 75 },
  },
  {
    id: "dest-3",
    name: "Coorg Coffee Valleys",
    country: "Karnataka, India",
    description: "Misty spice plantations, shola pine forests, and high suspension bridges crossing clean mountain rivers.",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80",
    category: "River",
    rating: 4.9,
    coordinates: { x: 42, y: 60 },
  },
  {
    id: "dest-4",
    name: "Jog Falls Gorges",
    country: "Karnataka, India",
    description: "The majestic Sharavathi river dropping 253 meters down sheer rocky cliffs of the Western Ghats under morning mist.",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
    category: "Waterfall",
    rating: 4.8,
    coordinates: { x: 38, y: 55 },
  },
  {
    id: "dest-5",
    name: "Mahabaleshwar Ridges",
    country: "Maharashtra, India",
    description: "Scenic overlooks of deep forest valleys emerging from morning fog under soft golden sunrises.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    category: "Mountain",
    rating: 4.75,
    coordinates: { x: 32, y: 35 },
  },
  {
    id: "dest-6",
    name: "Western Ghats Canopies",
    country: "Maharashtra, India",
    description: "An eco-safari through ancient monsoon forests, misty fort ridges, and biodiverse mountain reserves.",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80",
    category: "Adventure",
    rating: 4.92,
    coordinates: { x: 35, y: 28 },
  },
];

const mockPackages: Package[] = [
  {
    id: "pkg-1",
    title: "Ethereal Wayanad Bamboo & Mist Retreat",
    destination: "Wayanad Bamboo Forest",
    country: "Kerala, India",
    description: "Settle into a premium glass-walled treehouse suspended in the bamboo groves of Wayanad. Enjoy misty sunrise meditation, guided spice foraging hikes, and relaxing volcanic clay hot baths under old growth canopies.",
    price: 1250,
    duration: "5 Days",
    rating: 4.9,
    reviewCount: 184,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
    category: "Forest",
    weather: { temp: 22, condition: "Misty", humidity: 85 },
    highlights: ["Luxury Glass Canopy Treehouse", "Sunrise Spice Foraging", "Ancient Edakkal Cave Hike", "Organic Ayurveda Spa"],
    itinerary: [
      { day: 1, title: "Lodge Check-in & Canopy Dinner", desc: "Private eco-electric transfer to the forest lodge, greeting with local coconut nectars." },
      { day: 2, title: "Misty Bamboo Forest Hike", desc: "Embark on a silent morning trek listening to bamboo stalks creak, followed by spice tea harvest." },
      { day: 3, title: "Ancient Cave Exploration", desc: "Climb Ambukuthi Hills to catalog prehistoric rock carvings with our resident historian." },
      { day: 4, title: "Ayurveda Wellness Day", desc: "Rejuvenate with traditional hot-pot clay spa therapies surrounded by cascading forest moss." },
      { day: 5, title: "Farewell Treehouse Banquet", desc: "Dine on organic bamboo-shoot recipes inside your private high-canopy bubble." },
    ],
  },
  {
    id: "pkg-2",
    title: "Athirappilly Rainforest Cascade & Safari",
    destination: "Athirappilly Cascades",
    country: "Kerala, India",
    description: "Expeditions alongside India's most roaring waterfalls. Experience the thunderous mist sprays from a suspension walkway, raft down peaceful forest river channels, and rest in absolute eco-luxury overlooking the falls.",
    price: 1100,
    duration: "4 Days",
    rating: 4.85,
    reviewCount: 115,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    category: "Waterfall",
    weather: { temp: 25, condition: "Rainy", humidity: 90 },
    highlights: ["Overlook Glass Cabin", "Thunder Mist Walkway", "Bamboo Fjord Rafting", "Night Hornbill Tracking"],
    itinerary: [
      { day: 1, title: "Rainforest Cabin Welcome", desc: "Arrive at your premium cabin with floor-to-ceiling glass views of the waterfall cascade." },
      { day: 2, title: "Waterfall Footpath Journey", desc: "Hike through lush wet trails to the base of the waterfall to experience the cooling rain spray." },
      { day: 3, title: "Chalakkudy River Kayaking", desc: "Paddle down calm river tributaries flanked by towering teak forests and wild reeds." },
      { day: 4, title: "Night Hornbill Safari", desc: "Track rare, colorful canopy birds nesting in old-growth evergreen giants with spotters." },
    ],
  },
  {
    id: "pkg-3",
    title: "Coorg Spice Plantation & River Expedition",
    destination: "Coorg Coffee Valleys",
    country: "Karnataka, India",
    description: "Escape to the Scotland of India. Walk through aromatic cardamom and coffee forests, paddle down glacial streams on eco-kayaks, and sleep in solar-powered riverside glades under misty, starry skies.",
    price: 1350,
    duration: "6 Days",
    rating: 4.9,
    reviewCount: 142,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80",
    category: "River",
    weather: { temp: 20, condition: "Cloudy", humidity: 75 },
    highlights: ["Riverside Eco-Glade Suite", "Coffee Bean Roasting Workshop", "Cauvery River Kayaking", "Golden Temple Excursion"],
    itinerary: [
      { day: 1, title: "Arrive in Riverside Glades", desc: "Check-in to your premium glade, surrounded by cardamom woods and moving water." },
      { day: 2, title: "Coffee Harvest & Tasting", desc: "Learn how premium organic coffee beans are harvested, sun-dried, and custom roasted." },
      { day: 3, title: "River Kayak Navigation", desc: "Explore the gentle curves of the Cauvery river system inside low-draft solar hulls." },
      { day: 4, title: "Trek to Abbey Cascades", desc: "A guided moderate trek crossing hanging wooden suspension bridges to hidden pools." },
      { day: 5, title: "Monastery Silent Visit", desc: "Experience spiritual chants and peaceful temple lawns at Bylakuppe Tibetan settlement." },
      { day: 6, title: "Misty Glades Departure", desc: "Enjoy a final cardamom breakfast before checking out for airport shuttle connections." },
    ],
  },
  {
    id: "pkg-4",
    title: "Mahabaleshwar Valley Sunrise & Mist Retreat",
    destination: "Mahabaleshwar Ridges",
    country: "Maharashtra, India",
    description: "Soar above the clouds on the misty ridges of Mahabaleshwar. Stay in absolute zero-trace luxury overlooking deep valleys, hike through historic fort trails, and enjoy organic strawberry harvest picnics.",
    price: 980,
    duration: "4 Days",
    rating: 4.75,
    reviewCount: 94,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    category: "Mountain",
    weather: { temp: 18, condition: "Misty", humidity: 80 },
    highlights: ["Summit Crest Ridge Villa", "Fort Pratapgad Ridge Trek", "Organic Strawberry Foraging", "Zen Soundbath Overlook"],
    itinerary: [
      { day: 1, title: "Crest Villa Check-in", desc: "Ascend to the ridge-top villa offering pristine views of the Sahyadri mountains." },
      { day: 2, title: "Sunrise Valley Soundbath", desc: "Awaken for a soundbath meditation as thick morning mist climbs up the cliffs." },
      { day: 3, title: "Historic Pratapgad Hike", desc: "Trek old stone pathways leading to the hilltop fort, engulfed in clouds." },
      { day: 4, title: "Eco-Harvest Picnic", desc: "Harvest fresh strawberries in local organic fields followed by departures." },
    ],
  },
];

const mockGuides: TourGuide[] = [
  {
    id: "guide-1",
    name: "Ramesh Menon",
    role: "Ayurveda & Spice Master",
    rating: 4.96,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    bio: "Ramesh has guided treks through Wayanad forests for 15 years, specializing in native spice identification.",
  },
  {
    id: "guide-2",
    name: "Devendra Patil",
    role: "Western Ghats Mountaineer",
    rating: 4.89,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    bio: "A certified high-altitude search rescuer who knows every cloud cliff and historic trail in Maharashtra.",
  },
  {
    id: "guide-3",
    name: "Aanya Hegde",
    role: "River Kayaking Instructor",
    rating: 4.97,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    bio: "Aanya leads eco-safaris along Karnataka's rivers, cataloging local wildlife conservation parameters.",
  },
];

const mockBlogs: Blog[] = [
  {
    id: "blog-1",
    title: "Eco-Immersion in the Western Ghats: Monsoon Canopy",
    excerpt: "Why the heavy monsoons transform Coorg and Wayanad into the most active biodiverse hotspots on earth.",
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
    date: "June 24, 2026",
    readTime: "5 min read",
    author: "Ramesh Menon",
  },
  {
    id: "blog-2",
    title: "Chasing Western Ghats Mist: Morning Ridge Sunrise",
    excerpt: "Learn how to photograph high-altitude waterfalls and mist banks rolling over Maharashtra fortresses.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    date: "May 18, 2026",
    readTime: "7 min read",
    author: "Devendra Patil",
  },
  {
    id: "blog-3",
    title: "Sustainable Travel: Restoring Bamboo Groves",
    excerpt: "How travelers in Kerala are supporting local tree plantings to maintain canopy corridors.",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80",
    date: "April 02, 2026",
    readTime: "4 min read",
    author: "Aura Travel Eco Team",
  },
];

export function TravelProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    destination: "",
    dates: "",
    travelers: 1,
  });

  // Load wishlist & user state from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error(e);
      }
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      } catch (e) {
        console.error(e);
      }
    }

    const savedBookings = localStorage.getItem("bookings");
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const addBooking = (newBooking: Omit<Booking, "id">) => {
    const bookingWithId: Booking = {
      ...newBooking,
      id: `book-${Math.random().toString(36).substr(2, 9)}`,
    };
    setBookings((prev) => {
      const updated = [...prev, bookingWithId];
      localStorage.setItem("bookings", JSON.stringify(updated));
      return updated;
    });
  };

  const removeBooking = (id: string) => {
    setBookings((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      localStorage.setItem("bookings", JSON.stringify(updated));
      return updated;
    });
  };

  const login = (name: string, email: string) => {
    const userData = { name, email };
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
  };

  const updateSearchFilters = (filters: Partial<SearchFilters>) => {
    setSearchFilters((prev) => ({ ...prev, ...filters }));
  };

  return (
    <TravelContext.Provider
      value={{
        destinations: mockDestinations,
        packages: mockPackages,
        guides: mockGuides,
        blogs: mockBlogs,
        wishlist,
        bookings,
        isLoggedIn,
        user,
        language,
        searchFilters,
        toggleWishlist,
        addBooking,
        removeBooking,
        login,
        logout,
        setLanguage,
        updateSearchFilters,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useTravel() {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error("useTravel must be used within a TravelProvider");
  }
  return context;
}
