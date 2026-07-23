import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Heart,
  ChevronRight,
  MapPin,
  Phone,
  Instagram,
  Twitter,
  Clock,
  ExternalLink,
  Utensils,
  Zap,
  Dices,
  PartyPopper,
  Trophy,
  Star,
  Users,
  CheckCircle2,
  Coffee,
  Wine,
  Beer,
  Pizza,
  Sandwich,
  CupSoda,
  Beef,
  Drumstick,
  Egg,
  Sparkles,
  ChevronLeft,
  MoreVertical,
  Minus,
  Plus,
  Flame,
  Leaf,
  UtensilsCrossed,
  Cookie,
  ShoppingBag,
  ChevronDown,
  Share,
  X,
  ArrowLeft,
  Wifi,
  WifiOff,
  Lock,
  Tag,
  MousePointer2,
  ListFilter,
  Menu as MenuIcon,
  BadgePercent,
  Calendar,
} from "lucide-react";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { CATEGORIES, MENU_DATA, MenuItem, CAMPAIGNS, EVENTS, HEROSLIDES, HeroSlide } from "../data";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

// --- Header ---
export function Header({
  isLight,
  onSearchClick,
  onAdminClick,
  onLogoClick,
}: {
  isLight?: boolean;
  onSearchClick: () => void;
  onAdminClick?: () => void;
  onLogoClick?: () => void;
}) {
  return (
    <header
      className={`sticky top-0 z-[100] ${isLight ? "bg-white/80 border-black/5" : "bg-bamm-black/80 border-white/5"} backdrop-blur-md px-6 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 flex items-center justify-between border-b relative transition-colors duration-500`}
    >
      {/* Left Info/Greeting */}
      <div className="flex flex-col z-10">
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 ${isLight ? "text-gray-400" : "text-white/40"}`}>
          HOŞ GELDİNİZ
        </span>
        <div className={`flex items-center gap-1.5 ${isLight ? "text-gray-900" : "text-white"}`}>
          <MapPin size={12} className={isLight ? "text-black" : "text-bamm-yellow"} strokeWidth={2.5} />
          <span className="text-[13px] font-bold tracking-tight">BAMM Garden</span>
        </div>
      </div>

      {/* Centered Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div
          onClick={onLogoClick}
          className={`w-14 h-14 ${isLight ? "bg-white" : "bg-bamm-black"} rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.15)] overflow-hidden border ${isLight ? "border-black/5" : "border-white/10"} cursor-pointer active:scale-90 transition-transform`}
        >
          <img
            src="/logo.jpg"
            alt="BAMM Garden Logo"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="flex gap-2 relative z-10">
        <button
          onClick={onSearchClick}
          className={`w-9 h-9 ${isLight ? "bg-black/[0.03]" : "bg-white/5"} rounded-full flex items-center justify-center border ${isLight ? "border-black/5" : "border-white/10"} ${isLight ? "text-gray-400" : "text-gray-400"} active:scale-95 transition-transform`}
        >
          <Search size={14} strokeWidth={1.5} />
        </button>
        {onAdminClick && (
          <button
            onClick={onAdminClick}
            className={`w-9 h-9 ${isLight ? "bg-black/[0.03]" : "bg-white/5"} rounded-full flex items-center justify-center border ${isLight ? "border-black/5" : "border-white/10"} ${isLight ? "text-gray-400" : "text-gray-400"} active:scale-95 transition-transform`}
          >
            <Lock size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </header>
  );
}

// --- Search Modal ---
export function SearchModal({
  isOpen,
  onClose,
  onProductClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (item: MenuItem) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const results =
    query.trim() === ""
      ? []
      : MENU_DATA.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase()),
        ).slice(0, 8);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col p-6"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 bg-white/10 rounded-2xl flex items-center px-4 py-1 border border-white/10">
              <Search size={18} className="text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Lezzet ara..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-white font-bold placeholder:text-gray-500 h-12"
              />
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
            {results.map((item) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={item.id}
                onClick={() => {
                  onProductClick(item);
                  onClose();
                }}
                className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 border border-white/5 active:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-bamm-yellow/10 flex items-center justify-center shrink-0">
                  <Star size={20} className="text-bamm-yellow" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold truncate">{item.name}</h4>
                  <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">
                    {item.category}
                  </p>
                </div>
                <span className="text-bamm-yellow font-black italic">
                  {item.price}
                </span>
              </motion.div>
            ))}

            {query !== "" && results.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold lowercase">Sonuç bulunamadı...</p>
              </div>
            )}

            {query === "" && (
              <div className="pt-4">
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  Popüler Aramalar
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Burger", "Kokteyl", "Pizza", "Kahvaltı"].map((pop) => (
                    <button
                      key={pop}
                      onClick={() => setQuery(pop)}
                      className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold"
                    >
                      {pop}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Home Section ---
export function HomeSection({
  onMenuClick,
  onSocialClick,
  onSearchClick,
}: {
  onMenuClick: (category?: string) => void;
  onSocialClick: () => void;
  onSearchClick: () => void;
}) {
  const [activeCampaignIndex, setActiveCampaignIndex] = useState(0);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const campaignScrollRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; order: number; description?: string; image?: string }[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const cachedTime = localStorage.getItem("bamm_categories_cache_time");
    const cachedData = localStorage.getItem("bamm_categories_cache");
    let hasFreshCache = false;

    if (cachedData && cachedTime) {
      try {
        setDbCategories(JSON.parse(cachedData));
        // 30 seconds cache expiry
        if (Date.now() - Number(cachedTime) < 30 * 1000) {
          hasFreshCache = true;
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    if (hasFreshCache) {
      return;
    }
    
    const fetchFresh = async () => {
      try {
        const snap = await getDocs(collection(db, "categories"));
        if (!snap.empty) {
          const cats = snap.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as any))
            .filter(cat => !cat.deleted)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setDbCategories(cats);
          localStorage.setItem("bamm_categories_cache", JSON.stringify(cats));
          localStorage.setItem("bamm_categories_cache_time", String(Date.now()));
        }
      } catch (e) {
        console.error(e);
        setIsOffline(true);
      }
    };
    
    fetchFresh();
  }, []);

  const scrollHero = (direction: 'left' | 'right') => {
    if (heroScrollRef.current) {
      const container = heroScrollRef.current;
      const itemWidth = container.offsetWidth;
      container.scrollBy({
        left: direction === 'left' ? -itemWidth : itemWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleHeroScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const container = e.currentTarget;
    if (container.children.length > 0) {
      const firstChild = container.children[0] as HTMLElement;
      const itemWidth = firstChild.offsetWidth;
      const index = Math.round(scrollLeft / itemWidth);
      if (index !== activeHeroIndex && index >= 0 && index < HEROSLIDES.length) {
        setActiveHeroIndex(index);
      }
    }
  };

  const handleCampaignScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const container = e.currentTarget;
    if (container.children.length > 0) {
      const firstChild = container.children[0] as HTMLElement;
      const itemWidth = firstChild.offsetWidth + 16; // 16 is the gap-4
      const index = Math.round(scrollLeft / itemWidth);
      if (index !== activeCampaignIndex && index >= 0 && index < CAMPAIGNS.length) {
        setActiveCampaignIndex(index);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10 pb-32 animate-fade-in"
    >


      {/* Hero Section Container */}
      <div className="px-5 mt-4">
        {/* Scrollable Container with navigation */}
        <div className="relative group/hero">
          <div 
            ref={heroScrollRef}
            onScroll={handleHeroScroll}
            className="relative h-[480px] flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-[32px] shadow-2xl"
          >
            {HEROSLIDES.map((slide, idx) => (
              <div key={slide.id} className="min-w-full h-full relative snap-start shrink-0 group overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="mb-auto mt-8">
                    <span className="text-white font-bold tracking-[0.3em] text-[13px] block mb-2 drop-shadow-md">
                      {slide.subtitle}
                    </span>
                    <h2 className="text-white font-black text-5xl leading-[0.9] drop-shadow-lg mb-1" style={{fontFamily: 'Impact, sans-serif'}}>
                      {slide.title}
                    </h2>
                    <h2 className="text-bamm-yellow font-black text-6xl leading-[0.9] italic drop-shadow-lg transform -rotate-1" style={{fontFamily: 'Impact, sans-serif'}}>
                      {slide.highlight}
                    </h2>
                    <p className="text-gray-300 mt-6 text-[13px] leading-relaxed max-w-[200px] font-medium drop-shadow-md">
                      {slide.description}
                    </p>
                    
                    {/* Optional yellow line */}
                    <div className="w-12 h-[2px] bg-bamm-yellow mt-6 opacity-80" />
                  </div>
 
                  {/* Play Button - Menüye Git */}
                  <div className="flex items-center gap-4 mt-auto relative z-10">
                    <motion.button
                      onClick={() => onMenuClick()}
                      whileTap={{ scale: 0.95 }}
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-black/80 to-black/40 border border-bamm-yellow/30 flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                    >
                      <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[11px] border-l-bamm-yellow border-b-[7px] border-b-transparent ml-1" />
                    </motion.button>
                    <span className="text-gray-200 font-bold text-[11px] tracking-[0.2em] uppercase drop-shadow-md">
                      {slide.buttonText}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {HEROSLIDES.length > 1 && (
            <>
              <button 
                onClick={() => scrollHero('left')}
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white transition-all z-20 md:flex hidden hover:bg-black/50 ${activeHeroIndex === 0 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => scrollHero('right')}
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white transition-all z-20 md:flex hidden hover:bg-black/50 ${activeHeroIndex === HEROSLIDES.length - 1 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Swipe Hint for Mobile */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 md:hidden pointer-events-none">
            <motion.div 
              animate={{ x: [0, -8, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/5"
            >
              <ChevronLeft size={10} className="text-white/40" />
              <span className="text-white/60 text-[9px] font-bold tracking-[0.2em] uppercase">Kaydırın</span>
              <ChevronRight size={10} className="text-white/40" />
            </motion.div>
          </div>
        </div>

        {/* Carousel dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
          {HEROSLIDES.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${activeHeroIndex === idx ? 'bg-bamm-yellow w-4' : 'bg-white/30 w-1.5'}`} 
            />
          ))}
        </div>

        {/* Buttons Below Card */}
        <div className="flex items-center gap-3 mt-4">
          <button
             onClick={() => onMenuClick()}
             className="flex-1 bg-gradient-to-r from-bamm-yellow to-[#FACC15] text-black font-black py-4 px-2 rounded-[20px] flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(250,204,21,0.2)] active:scale-[0.98] transition-transform"
          >
            <MenuIcon size={18} strokeWidth={2.5} className="text-black" />
            <span className="text-[12px] tracking-[0.15em] uppercase">MENÜYÜ GÖR</span>
          </button>
          
          <button
            onClick={onSocialClick}
             className="flex-1 bg-[#1C1D21] border border-white/5 text-white font-bold py-4 px-2 rounded-[20px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
          >
            <Calendar size={18} strokeWidth={2} className="text-bamm-yellow" />
            <span className="text-[12px] tracking-[0.15em] uppercase text-gray-100">REZERVASYON</span>
          </button>
        </div>
      </div>

      {/* Campaigns Section - With Padding */}
      <div className="space-y-4 px-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold italic uppercase tracking-tight">
              Kampanyalar
            </h2>
          </div>
          <button onClick={() => onMenuClick("Kampanyalar")} className="text-gray-500 text-[9px] font-black tracking-widest uppercase active:text-white transition-colors">
            TÜMÜ
          </button>
        </div>

        <div className="relative">
          <div 
            ref={campaignScrollRef}
            onScroll={handleCampaignScroll}
            className="flex gap-4 overflow-x-auto no-scrollbar pb-8 -mx-6 px-6"
          >
            {CAMPAIGNS.map((campaign, i) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => onMenuClick(campaign.category)}
                className="min-w-[85vw] sm:min-w-[320px] h-[340px] relative rounded-[32px] overflow-hidden group border border-white/5 shadow-2xl cursor-pointer active:scale-[0.98] transition-transform shrink-0"
              >
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {i === 0 && (
                    <div className="bg-white/10 backdrop-blur-md w-fit px-2.5 py-1 rounded-md mb-4 border border-white/10 shrink-0">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">
                        ÖNE ÇIKAN
                      </span>
                    </div>
                  )}
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-[0.85] mb-3 drop-shadow-md">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-200 text-[11px] font-medium uppercase tracking-wider leading-relaxed opacity-90 mb-5 line-clamp-2 drop-shadow-md">
                    {campaign.description}
                  </p>
                  <div className="mt-auto w-fit flex items-center gap-2 bg-bamm-yellow text-bamm-black px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                    DETAYLI İNCELE <ChevronRight size={14} strokeWidth={2.5} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicators (Dots) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
            {CAMPAIGNS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeCampaignIndex === i 
                    ? "w-4 bg-bamm-yellow shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
                    : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 px-6 md:px-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-bold italic uppercase tracking-tight">
            Kategoriler
          </h2>
          <button
            onClick={() => onMenuClick()}
            className="text-bamm-yellow text-[9px] font-black tracking-[0.2em] uppercase border-b border-bamm-yellow/20 pb-0.5"
          >
            Tümünü Gör
          </button>
        </div>
        <div 
          ref={categoryScrollRef}
          className="flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto lg:overflow-visible no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 pb-6"
        >
          {[
            {
              name: "Kokteyller",
              img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600",
              color: "#A855F7",
            },
            {
              name: "Kahvaltı",
              img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600",
              color: "#06B6D4",
            },
            {
              name: "Biralar",
              img: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=600",
              color: "#EAB308",
            },
            {
              name: "Tatlılar",
              img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=600",
              color: "#D946EF",
            },
            {
              name: "Soğuk İçecekler",
              img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600",
              color: "#3B82F6",
            },
          ].map((cat, i) => {
            const dbCat = dbCategories.find(c => c.name === cat.name);
            const imageToShow = dbCat?.image || cat.img;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMenuClick(cat.name)}
                className="min-w-[160px] h-56 rounded-[32px] relative overflow-hidden group cursor-pointer shadow-2xl border border-white/5"
              >
                <img
                  src={imageToShow}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-bamm-black via-bamm-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Layout Decor */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                <ChevronRight size={14} className="text-white" />
              </div>

              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div
                  className="w-6 h-1 rounded-full mb-3 transition-all duration-500 group-hover:w-12 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="block text-sm font-black italic uppercase text-white tracking-[0.2em] leading-none">
                  {cat.name}
                </span>
              </div>

              {/* Texture/Overlay */}
              <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-[32px]" />
            </motion.div>
          )})}
        </div>
      </div>



      {/* Social Media Footer */}
      <div className="pt-10 pb-8 mt-4 flex flex-col items-center justify-center border-t border-black/[0.04]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-[1px] bg-black/10"></div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            Bizi Takip Et
          </h3>
          <div className="w-10 h-[1px] bg-black/10"></div>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="https://instagram.com/bammgarden"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center text-gray-800 shadow-[0_8px_16px_rgba(0,0,0,0.04)] border border-black/[0.02] hover:-translate-y-1.5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:shadow-[0_12px_24px_rgba(220,39,67,0.25)] active:scale-95 transition-all duration-300 group"
          >
            <Instagram
              size={22}
              strokeWidth={2}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// --- PWA Install Modal ---
export function PwaInstallModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
          className="fixed bottom-[100px] left-4 right-4 z-[400] flex justify-center pointer-events-none"
        >
          <div className="bg-[#1C1C1E]/95 backdrop-blur-xl shadow-2xl border border-bamm-yellow/20 rounded-[28px] p-5 w-full max-w-sm pointer-events-auto flex items-center gap-4 relative overflow-hidden">
            {/* Glossy highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            <div className="w-12 h-12 bg-gradient-to-br from-[#FDE047] to-[#EAB308] rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(234,179,8,0.3)]">
              <Share size={20} className="text-black" strokeWidth={2.5} />
            </div>

            <div className="flex-1 pr-6">
              <h3 className="text-sm font-black text-white tracking-tight leading-tight mb-1 uppercase">
                Uygulama Gibi Kullan
              </h3>
              <p className="text-[11px] text-[#8BA5BE] font-medium leading-snug">
                Tarayıcı menüsünden{" "}
                <span className="text-white font-bold">"Ana Ekrana Ekle"</span>{" "}
                diyerek ana ekranınıza ekleyin.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Category Icon Mapping
const CATEGORY_ICONS: Record<string, any> = {
  Popüler: Star,
  Kahvaltı: Coffee,
  Atıştırmalıklar: Zap,
  Salatalar: Leaf,
  Yemekler: UtensilsCrossed,
  Tatlılar: Cookie,
  Kokteyller: Wine,
  "Alkolsüz Kokteyller": CupSoda,
  Kampanyalar: BadgePercent,
  Biralar: Beer,
  Shotlar: Flame,
  "Sıcak İçecekler": Coffee,
  "Soğuk İçecekler": CupSoda,
  "Soft İçecekler": CupSoda,
  "Soğuk Kahveler": CupSoda,
};

const CATEGORY_DESCS: Record<string, string> = {
  Popüler: "En sevilen favoriler",
  Kampanyalar: "Özel fırsatlar ve avantajlar",
  Yemekler: "Lezzetli yemek seçenekleri",
  Kadeh: "Kadeh şarap ve içecekler",
  Şişeler: "Premium şişe içecekler",
  Şarap: "Kırmızı, beyaz ve roze şaraplar",
  Kahvaltı: "Güne güzel başla",
  Kokteyller: "İmza ve klasik lezzetler",
  Biralar: "Fıçı ve şişe biralar",
  Shotlar: "Çeşitli alkollü shot seçenekleri",
};
const getCategoryDescription = (cat: string) => CATEGORY_DESCS[cat] || "Bamm Garden Lezzetleri";

const CATEGORY_LABELS: Record<string, string> = {
  Popüler: "POPÜLER",
  Kahvaltı: "KAHVALTI",
  Atıştırmalıklar: "ATIŞTIR",
  Salatalar: "SALATA",
  Yemekler: "YEMEK",
  Tatlılar: "TATLILAR",
  Kokteyller: "KOKTEYL",
  "Alkolsüz Kokteyller": "ALKOLSÜZ",
  Kampanyalar: "KAMPANYA",
  Biralar: "BİRA",
  Shotlar: "SHOTLAR",
  "Sıcak İçecekler": "SICAK",
  "Soğuk İçecekler": "SOĞUK",
  "Soft İçecekler": "SOFT",
  "Soğuk Kahveler": "S.KAHVE",
};

const CATEGORY_ORDER = [
  "Kampanyalar",
  "Biralar",
  "Kokteyller",
  "Shotlar",
  "Yemekler",
  "Popüler",
  "Atıştırmalıklar",
  "Salatalar",
  "Kahvaltı",
  "Tatlılar",
  "Alkolsüz Kokteyller",
  "Şarap",
  "Kadeh",
  "Şişeler",
  "Kahveler",
  "Soğuk Kahveler",
  "Çaylar",
  "Sıcak İçecekler",
  "Soğuk İçecekler",
  "Soft İçecekler"
];

const PREFERRED_SUBCAT_ORDER = [
  // Yemekler
  "Breakfast", "Omletler", "Sahanda", "Tostlar", "Kahvaltı Yanı",
  "Beyaz Etler", "Kırmızı Etler", "Burgerler", "Wrapler", "Makarnalar", "Pizzalar",
  // Kokteyller & İçecekler
  "İmza Kokteylleri", "Dünya Klasikleri",
  "Healthy Detox", "Smoothie", "Frozen", "Milkshakes", "Limonata",
  "Fıçı Biralar", "Şişe Biralar", "Kova Biralar", "İthal Biralar",
  "Klasik", "Bitki Çayları",
  // Alkol & Şişeler
  "Kadeh", "Şişeler",
  "Vodka", "Gin", "Tekila", "Rakı", "Şarap", "Viski",
  "Vodka Shotlar", "Likör Shotlar", "Cin Shotlar", "Tekila Shotlar", "Viski Shotlar",
  // Kampanyalar & Tatlılar
  "1+1", "Shoot", "Fıçı Kampanya",
  "Sıcaklar", "Soğuklar"
];

// --- Menu Section ---
export function MenuSection({
  onProductClick,
  onSearchClick,
  onBackClick,
  initialCategory,
}: {
  onProductClick: (item: MenuItem) => void;
  onSearchClick: () => void;
  onBackClick?: () => void;
  initialCategory?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || CATEGORIES[0],
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [liveMenu, setLiveMenu] = useState<MenuItem[]>(MENU_DATA);
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; order: number; description?: string }[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    setSelectedSubcategory("Tümü");
  }, [selectedCategory]);

  const CACHE_EXPIRY_MS = 30 * 1000; // 30 seconds cache expiry

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cachedData = localStorage.getItem("bamm_categories_cache");
        const cachedTime = localStorage.getItem("bamm_categories_cache_time");
        
        if (cachedData && cachedTime) {
          const parsed = JSON.parse(cachedData);
          setDbCategories(parsed);
          
          if (Date.now() - Number(cachedTime) < CACHE_EXPIRY_MS) {
            return;
          }
        }
        
        const snap = await getDocs(collection(db, "categories"));
        if (!snap.empty) {
          const cats = snap.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as any))
            .filter(cat => !cat.deleted)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setDbCategories(cats);
          localStorage.setItem("bamm_categories_cache", JSON.stringify(cats));
          localStorage.setItem("bamm_categories_cache_time", String(Date.now()));
        } else {
          setDbCategories([]);
          localStorage.setItem("bamm_categories_cache", JSON.stringify([]));
          localStorage.setItem("bamm_categories_cache_time", String(Date.now()));
        }
      } catch (error) {
        console.warn("Firestore categories fetch error: ", error);
        setIsOffline(true);
      }
    };

    loadCategories();
  }, []);

  const dynamicCategories = Array.from(
    new Set([
      ...(dbCategories.length > 0 ? dbCategories.map(c => c.name) : CATEGORIES),
      ...liveMenu.map((item) => item.category).filter(Boolean),
    ])
  ).filter(cat => cat !== "Sıcak İçecekler").sort((a, b) => {
    const catA = dbCategories.find(c => c.name === a);
    const catB = dbCategories.find(c => c.name === b);
    if (catA && catB) return catA.order - catB.order;
    if (catA) return -1;
    if (catB) return 1;

    const orderA = CATEGORY_ORDER.indexOf(a);
    const orderB = CATEGORY_ORDER.indexOf(b);
    if (orderA !== -1 && orderB !== -1) return orderA - orderB;
    if (orderA !== -1) return -1;
    if (orderB !== -1) return 1;
    return a.localeCompare(b);
  });

  const getCatDescription = (cat: string) => {
    const dbCat = dbCategories.find(c => c.name === cat);
    if (dbCat && dbCat.description) return dbCat.description;
    return CATEGORY_DESCS[cat] || "Bamm Garden Lezzetleri";
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const cachedData = localStorage.getItem("bamm_products_cache");
        const cachedTime = localStorage.getItem("bamm_products_cache_time");
        
        if (cachedData && cachedTime) {
          const parsed = JSON.parse(cachedData);
          setLiveMenu(parsed);
          
          if (Date.now() - Number(cachedTime) < CACHE_EXPIRY_MS) {
            return;
          }
        }
        
        const snap = await getDocs(collection(db, "products"));
        let dbProducts: any[] = [];
        if (!snap.empty) {
          dbProducts = snap.docs.map((doc) => {
            const data = doc.data() as any;
            if (["Burgerler", "Pizzalar", "Makarnalar", "Dürümler & Bowl", "Ana Yemekler"].includes(data.category)) {
              data.subcategory = data.category === "Dürümler & Bowl" ? "Wrapler" : (data.category === "Ana Yemekler" ? "Beyaz Etler" : data.category);
              data.category = "Yemekler";
            } else if (data.category === "Tost & Sandviç") {
              data.subcategory = "Tostlar";
              data.category = "Kahvaltı";
            }
            return { id: doc.id, ...data };
          });
        }
        
        const merged = [...MENU_DATA];
        dbProducts.forEach((dbP) => {
          const idx = merged.findIndex((m) => m.id === dbP.id);
          if (idx !== -1) merged[idx] = dbP;
          else merged.push(dbP);
        });

        const filteredLiveMenu = merged.filter(p => !p.deleted);
        setLiveMenu(filteredLiveMenu);
        localStorage.setItem("bamm_products_cache", JSON.stringify(filteredLiveMenu));
        localStorage.setItem("bamm_products_cache_time", String(Date.now()));
      } catch (error) {
        console.warn("Firestore products fetch error: ", error);
        setIsOffline(true);
      }
    };

    loadProducts();
  }, []);

  const categorySubcategories = useMemo(() => {
    if (selectedCategory === "Popüler") return [];
    
    const subs = Array.from(
      new Set(
        liveMenu
          .filter(item => item.category === selectedCategory && item.subcategory)
          .map(item => item.subcategory as string)
      )
    ) as string[];

    return subs.sort((a, b) => {
      const idxA = PREFERRED_SUBCAT_ORDER.indexOf(a);
      const idxB = PREFERRED_SUBCAT_ORDER.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [liveMenu, selectedCategory]);

  const filteredItems = liveMenu.filter((item) => {
    const matchesCategory =
      selectedCategory === "Popüler"
        ? item.isPopular
        : item.category === selectedCategory;

    let matchesSubcategory = true;
    if (selectedSubcategory !== "Tümü") {
      matchesSubcategory = item.subcategory === selectedSubcategory;
    }

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen flex flex-col pt-[env(safe-area-inset-top)]"
    >

      {/* White Top Header Area */}
      <div className="bg-white pt-4 pb-8">
        <div className="px-6 flex items-center justify-between mb-8">
          <button 
            onClick={onBackClick}
            className="w-10 h-10 flex items-center justify-center text-gray-900 hover:scale-110 transition-transform bg-gray-50 rounded-full border border-gray-100 shadow-sm"
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </button>

          <div className="flex flex-col items-center justify-center">
            <span className="text-xl font-black tracking-widest text-bamm-black uppercase">
              MENÜ
            </span>
          </div>

          <button
            onClick={onSearchClick}
            className="w-10 h-10 flex items-center justify-center text-gray-900 hover:scale-110 transition-transform bg-gray-50 rounded-full border border-gray-100 shadow-sm"
          >
            <Search size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Campaign / Happy Hour Banner */}
        <div className="px-4 mb-8 mt-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[220px] rounded-[24px] overflow-hidden flex flex-col justify-center shadow-[0_12px_32px_rgba(0,0,0,0.15)] cursor-pointer active:scale-[0.98] transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=800"
              alt="Happy Hour"
              className="absolute inset-0 w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B101A]/95 via-[#0B101A]/80 to-transparent" />
            
            {/* Dot Pattern Overlay */}
            <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
            
            <div className="relative z-10 px-6 sm:px-8 w-[90%] sm:w-2/3">
              <div className="relative inline-block mb-3">
                {/* Decorative sparks */}
                <div className="absolute -top-3 -right-2 flex gap-1.5">
                  <div className="w-1 h-3 bg-bamm-yellow rounded-full -rotate-[25deg] translate-y-1" />
                  <div className="w-1 h-3.5 bg-bamm-yellow rounded-full rotate-12 -translate-y-1" />
                  <div className="w-1 h-3 bg-bamm-yellow rounded-full rotate-[45deg] translate-y-2" />
                </div>
                
                <h2 
                  className="text-bamm-yellow text-[38px] sm:text-[46px] font-black leading-[0.85] tracking-tight uppercase" 
                  style={{ transform: 'scaleY(1.2)', transformOrigin: 'bottom left', fontFamily: 'Impact, sans-serif' }}
                >
                  HAPPY HOUR
                </h2>
              </div>
              
              <div className="flex items-center gap-2 mb-4 mt-2">
                <Clock
                  size={20}
                  className="text-bamm-yellow"
                  strokeWidth={2.5}
                />
                <span className="text-white text-[15px] font-bold tracking-widest">
                  19:00 'A KADAR
                </span>
              </div>
              
              <div className="w-48 h-[1px] bg-gradient-to-r from-bamm-yellow to-transparent mb-4 opacity-60" />
              
              <div className="flex flex-col">
                <span className="text-white text-sm sm:text-[15px] font-normal tracking-wide mb-1">
                  CUMARTESİ HARİÇ HER GÜN
                </span>
                <span 
                  className="text-bamm-yellow text-[22px] sm:text-[30px] font-black italic tracking-tighter leading-none uppercase" 
                  style={{ transform: 'scaleY(1.1)', transformOrigin: 'bottom left', fontFamily: 'Impact, sans-serif' }}
                >
                  TUBORG ŞİŞE 140 TL
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="px-6 flex items-start gap-4">
          <div className="w-[52px] h-[52px] bg-[#FFF8D6] rounded-full flex items-center justify-center text-[#0F172A] shrink-0 mt-1 overflow-hidden">
            {(() => {
              const dbCat = dbCategories.find(c => c.name === selectedCategory);
              if (dbCat?.image) {
                return (
                  <img
                    src={dbCat.image}
                    alt={selectedCategory}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                );
              }
              const TitleIcon = CATEGORY_ICONS[selectedCategory] || Utensils;
              return <TitleIcon size={26} strokeWidth={2.5} />;
            })()}
          </div>
          <div>
            <h1 className="text-[40px] leading-none font-black text-gray-900 tracking-tight mb-2">
              {selectedCategory === "Popüler" ? "Favoriler" : selectedCategory}
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              {getCatDescription(selectedCategory)}
            </p>
          </div>
        </div>
      </div>

      {/* Category Navigation Area */}
      <div className="bg-white rounded-t-[40px] pt-6 flex-1 flex flex-col relative shadow-[0_-10px_20px_rgba(0,0,0,0.02)] border-t border-gray-100">
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-6 shrink-0">
          {dynamicCategories
            .map((cat) => {
            const isActive = selectedCategory === cat;
            const Icon = CATEGORY_ICONS[cat] || Utensils;
            const itemCount = liveMenu.filter(item => cat === "Popüler" ? item.isPopular : item.category === cat).length;
            const dbCat = dbCategories.find(c => c.name === cat);
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative flex flex-col items-center justify-start min-w-[100px] w-[100px] pt-4 pb-4 px-2 rounded-[24px] transition-all duration-300 ${
                  isActive
                    ? "bg-[#FFF9E5] border border-bamm-yellow shadow-sm"
                    : "bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                }`}
              >
                <div
                  className={`relative rounded-full flex items-center justify-center transition-all duration-300 mb-2 overflow-hidden ${
                    isActive
                      ? "w-14 h-14 bg-bamm-yellow text-black"
                      : "w-14 h-14 bg-[#F4F4F5] text-gray-400 group-hover:bg-[#E4E4E7] group-hover:text-gray-900"
                  }`}
                >
                  {dbCat?.image ? (
                    <img
                      src={dbCat.image}
                      alt={cat}
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Icon
                      size={24}
                      strokeWidth={1.5}
                    />
                  )}
                </div>
                
                {itemCount > 0 && (
                  <div className={`absolute top-2 right-2 flex items-center justify-center rounded-full text-[10px] font-bold shadow-sm border-2 border-white min-w-[24px] h-[24px] px-1 ${
                    isActive ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {itemCount}
                  </div>
                )}
                
                <span
                  className={`text-[11px] font-black uppercase tracking-wide text-center transition-all duration-300 mb-0.5 ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat.toUpperCase()}
                </span>
                
                <span className="text-[9px] font-medium text-gray-400 text-center leading-[1.2] px-1">
                  {getCatDescription(cat)}
                </span>
              
                {isActive && (
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-bamm-yellow rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {categorySubcategories.length > 0 && (
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-6 pb-6 shrink-0 -mt-2">
            {["Tümü", ...categorySubcategories].map((subcat) => {
              const isActive = selectedSubcategory === subcat;
              return (
                <button
                  key={subcat}
                  onClick={() => setSelectedSubcategory(subcat)}
                  className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-[12px] md:text-[13px] font-extrabold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border ${
                    isActive
                      ? "bg-bamm-yellow text-black border-bamm-yellow shadow-md shadow-bamm-yellow/20 scale-105"
                      : "bg-white text-gray-700 border-gray-200/80 hover:bg-gray-50 hover:border-gray-300 active:scale-95 shadow-sm"
                  }`}
                >
                  {subcat === "Tümü" && (
                    <ListFilter size={14} className={isActive ? "text-black shrink-0" : "text-gray-500 shrink-0"} />
                  )}
                  <span>{subcat}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Product List - Horizontal Cards */}
        <div className="bg-[#F8F9FA] flex-1 rounded-t-[40px] px-6 pt-8 pb-32 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 space-y-0 align-start items-start content-start">
          <AnimatePresence mode="popLayout">
            {selectedCategory === "Shotlar" ? (
              // If it's Shotlar, group them by subcategory
              (() => {
                const subcats = selectedSubcategory === "Tümü"
                  ? categorySubcategories
                  : [selectedSubcategory];

                return subcats.map((subcat) => {
                  const subcatItems = filteredItems.filter(item => item.subcategory === subcat);
                  if (subcatItems.length === 0) return null;

                  return (
                    <div key={subcat} className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 align-start items-start content-start">
                      {/* Subcategory title banner */}
                      <div className="col-span-full pt-6 pb-2 border-b border-gray-200/50 flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-[#B49E72] bg-[#FFF8D6] px-4 py-1.5 rounded-full">
                          {subcat}
                        </span>
                        <div className="h-[2px] bg-gray-100 flex-1 mx-4"></div>
                        <span className="text-[11px] text-gray-400 font-extrabold tracking-wide uppercase">
                          {subcatItems.length} Çeşit
                        </span>
                      </div>

                      {subcatItems.map((item, idx) => {
                        const ItemIcon = CATEGORY_ICONS[item.category] || Utensils;
                        return (
                          <motion.div
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.03 }}
                            key={item.id}
                            onClick={() => onProductClick(item)}
                            className="bg-white rounded-[32px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-black/[0.04] flex items-center gap-5 relative group active:scale-[0.98] transition-all cursor-pointer overflow-hidden"
                          >
                            <div className="absolute right-0 top-0 w-32 h-32 bg-gray-50 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="w-[68px] h-[68px] rounded-[24px] bg-gray-50 flex-shrink-0 flex items-center justify-center relative border border-black/[0.02] group-hover:scale-105 group-hover:shadow-[0_8px_16px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-hidden">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ItemIcon
                                  size={28}
                                  className="text-gray-400 group-hover:text-black transition-colors"
                                  strokeWidth={1.5}
                                />
                              )}

                              {item.isPopular && (
                                <div className="absolute -top-2 -right-2 bg-bamm-yellow text-black p-1.5 rounded-xl shadow-sm rotate-12 group-hover:rotate-0 transition-transform">
                                  <Star size={10} fill="currentColor" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-center pb-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B49E72] bg-[#FFF8D6]/30 px-2 py-0.5 rounded-md">
                                  {subcat}
                                </span>
                              </div>
                              <h3 className="text-base font-bold text-gray-900 leading-tight mb-2 pr-4">
                                {item.name}
                              </h3>
                              <p className="text-[11px] text-gray-500 line-clamp-1 leading-relaxed max-w-[90%]">
                                {item.description}
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-3 pl-2 relative z-10 flex-shrink-0">
                              <div className="flex items-baseline gap-0.5">
                                <span className="text-[22px] font-black text-gray-900 tracking-tighter">
                                  {item.price.replace(/ TL|₺/g, "")}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400">
                                  TL
                                </span>
                              </div>
                              <div className="w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center shadow-md opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 absolute -right-2 bottom-0">
                                <ChevronRight size={20} />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                });
              })()
            ) : (
              // Otherwise, render normally
              filteredItems.map((item, idx) => {
                const ItemIcon = CATEGORY_ICONS[item.category] || Utensils;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.03 }}
                    key={item.id}
                    onClick={() => onProductClick(item)}
                    className="bg-white rounded-[32px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-black/[0.04] flex items-center gap-5 relative group active:scale-[0.98] transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 w-32 h-32 bg-gray-50 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="w-[68px] h-[68px] rounded-[24px] bg-gray-50 flex-shrink-0 flex items-center justify-center relative border border-black/[0.02] group-hover:scale-105 group-hover:shadow-[0_8px_16px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ItemIcon
                          size={28}
                          className="text-gray-400 group-hover:text-black transition-colors"
                          strokeWidth={1.5}
                        />
                      )}

                      {item.isPopular && (
                        <div className="absolute -top-2 -right-2 bg-bamm-yellow text-black p-1.5 rounded-xl shadow-sm rotate-12 group-hover:rotate-0 transition-transform">
                          <Star size={10} fill="currentColor" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center pb-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                          {CATEGORY_LABELS[item.category] || item.category}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 leading-tight mb-2 pr-4">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 line-clamp-1 leading-relaxed max-w-[90%]">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3 pl-2 relative z-10 flex-shrink-0">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[22px] font-black text-gray-900 tracking-tighter">
                          {item.price.replace(/ TL|₺/g, "")}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          TL
                        </span>
                      </div>
                      <div className="w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center shadow-md opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 absolute -right-2 bottom-0">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="py-20 text-center space-y-3">
              <div className="text-gray-200 flex justify-center">
                <Search size={48} strokeWidth={1} />
              </div>
              <p className="text-gray-400 font-medium">
                Buralar biraz sessiz...
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- Campaigns Section ---
export function CampaignsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 pb-32"
    >
      <h2 className="text-xl font-bold mb-6">Özel Kampanyalar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CAMPAIGNS.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-gradient-to-br from-bamm-anthracite to-bamm-black border border-bamm-yellow/20 rounded-3xl overflow-hidden relative group"
          >
            <div className="p-6 relative z-10">
              <span className="bg-bamm-yellow text-bamm-black px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4 inline-block">
                Fırsat Paneli
              </span>
              <h3 className="text-lg font-bold mb-2 group-hover:text-bamm-yellow transition-colors">
                {campaign.title}
              </h3>
              <p className="text-sm text-gray-400 mb-6">{campaign.description}</p>
              <button className="flex items-center gap-2 text-bamm-yellow font-bold text-sm">
                Detayları İncele <ChevronRight size={16} />
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-bamm-yellow/10 rounded-full blur-3xl -mb-10 -mr-10" />
            <div className="absolute top-0 right-4 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Zap size={80} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- Events Section ---
export function EventsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-6 pb-32"
    >
      <h2 className="text-xl font-bold mb-6">Yaklaşan Etkinlikler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {EVENTS.map((event) => (
          <div
            key={event.id}
            className="flex gap-4 p-4 bg-bamm-anthracite/30 rounded-2xl border border-white/5 backdrop-blur-sm"
          >
            <div className="w-14 flex-shrink-0 flex flex-col items-center justify-center bg-bamm-anthracite rounded-xl py-2 border border-white/5">
              <span className="text-[10px] uppercase font-black text-gray-500">
                {event.date.split(" ")[2]}
              </span>
              <span className="text-lg font-black text-bamm-yellow">
                {event.date.split(" ")[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase mb-1">
                <Clock size={10} /> {event.time}
              </div>
              <h3 className="font-bold text-sm mb-1 truncate">{event.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-1">
                {event.description}
              </p>
            </div>
            <button className="self-center p-2 bg-white/5 rounded-full">
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
      <div className="bg-bamm-yellow/5 border border-bamm-yellow/20 p-6 rounded-2xl text-center">
        <p className="text-xs font-bold text-bamm-yellow uppercase tracking-widest mb-2">
          Özel Organizasyonlar
        </p>
        <p className="text-sm text-gray-300 px-4">
          Doğum günü, parti ve özel geceleriniz için bizimle iletişime geçin.
        </p>
      </div>
    </motion.div>
  );
}

// --- Info / Contact Modal ---
export function InfoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const info = {
    name: "BAMM GARDEN & NIGHT",
    tagline: "Garden & Night Experience",
    phone: "+90 216 000 00 00",
    instagram: "@bammgarden",
    address: "Bursa, Görükle",
    hours: "Her Gün: 08:00 - 02:00",
    wifi: {
      ssid: "BAMMGarden_Guest",
      pass: "bamm2025",
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div className="bg-[#111111] w-full max-w-[400px] rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar pointer-events-auto flex flex-col">
              
              {/* Header Image Area */}
              <div className="relative w-full h-40 bg-zinc-900 border-b border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800"
                  alt="BAMM Garden Background"
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 active:scale-95 transition-all border border-white/10 z-20"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Profile / Status */}
              <div className="px-6 relative -mt-12 flex flex-col z-10 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-[#0A0A0A] p-1 border border-white/10 shadow-xl mb-4">
                  <div className="w-full h-full rounded-xl bg-black overflow-hidden relative group">
                    <img
                      src="/logo.jpg"
                      alt="BAMM Logo"
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white flex justify-between items-start">
                    {info.name}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">{info.tagline}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-4 mt-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold">Açık - 02:00'a kadar</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 grid grid-cols-2 gap-3 mb-6">
                <a
                  href={`tel:${info.phone}`}
                  className="flex items-center justify-center gap-2 bg-white text-black py-3 px-4 rounded-xl font-medium text-sm active:scale-95 transition-transform hover:bg-gray-100"
                >
                  <Phone size={16} />
                  <span>Ara</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white py-3 px-4 rounded-xl font-medium text-sm active:scale-95 transition-transform hover:bg-white/10"
                >
                  <MapPin size={16} />
                  <span>Yol Tarifi</span>
                </a>
              </div>

              {/* Details List */}
              <div className="px-6 flex flex-col gap-3 mb-8">
                {/* Instagram */}
                <a 
                  href={`https://instagram.com/${info.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-pink-400 group-hover:bg-pink-400/10 transition-colors">
                    <Instagram size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white group-hover:text-pink-400 transition-colors">Instagram</span>
                    <span className="text-xs text-gray-500 mt-0.5">{info.instagram}</span>
                  </div>
                </a>

                {/* Hours */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                    <Clock size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">Çalışma Saatleri</span>
                    <span className="text-xs text-gray-500 mt-0.5">{info.hours}</span>
                  </div>
                </div>

                {/* WiFi Card */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-gradient-to-br from-bamm-yellow/10 to-transparent border border-bamm-yellow/20 relative overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-bamm-yellow/20 flex items-center justify-center text-bamm-yellow">
                      <Wifi size={18} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-medium">Ağ / SSID</span>
                        <span className="text-sm font-semibold text-white">{info.wifi.ssid}</span>
                      </div>
                      <div className="flex flex-col mt-0.5">
                        <span className="text-[10px] text-gray-400 font-medium">Şifre</span>
                        <span className="text-sm font-mono text-bamm-yellow">{info.wifi.pass}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 w-32 h-32 bg-bamm-yellow/10 rounded-full blur-xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Contact Section ---
export function ContactSection({
  onSearchClick,
  onAdminClick,
}: {
  onSearchClick: () => void;
  onAdminClick?: () => void;
}) {
  const info = {
    name: "BAMM GARDEN & NIGHT",
    tagline: "Garden & Night Experience",
    phone: "+90 216 000 00 00",
    instagram: "@bammgarden",
    address: "Bursa, Görükle",
    hours: "Her Gün: 08:00 - 02:00",
    wifi: {
      ssid: "BAMMGarden_Guest",
      pass: "bamm2025",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#111216] min-h-screen pb-32 flex flex-col"
    >
      <div className="flex flex-col items-center pt-8 px-6">
        <div className="text-center mb-8 w-full">
          <h2 className="text-[52px] leading-none font-black text-white tracking-tighter">
            iletişim<span className="text-[#FACC15]">.</span>
          </h2>
          <p className="text-[#8BA5BE] font-medium text-[15px]">
            Bizimle kolayca iletişime geçin.
          </p>
        </div>

        <div className="w-full max-w-sm rounded-[40px] border border-bamm-yellow/30 shadow-[0_32px_64px_rgba(0,0,0,0.8)] relative overflow-hidden bg-[#1C1C1E] p-6 sm:p-8 flex flex-col items-center">
          {/* Logo/Image */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-bamm-yellow/20 to-transparent p-1 mb-4 sm:mb-6 mt-2 shrink-0 border border-bamm-yellow/10">
            <div className="w-full h-full rounded-full bg-bamm-black overflow-hidden border-2 border-bamm-yellow/20 shadow-[0_0_40px_rgba(255,215,0,0.15)] flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="BAMM"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 shrink-0">
            <h2 className="text-xl sm:text-2xl font-black text-bamm-yellow tracking-tighter uppercase italic leading-tight mb-1 sm:mb-2">
              {info.name}
            </h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
              {info.tagline}
            </p>
          </div>

          {/* Action Icons */}
          <div className="flex gap-4 mb-6 sm:mb-10 shrink-0">
            <a
              href={`https://instagram.com/${info.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white/5 rounded-full flex items-center justify-center text-bamm-yellow border border-white/10 active:scale-90 transition-all hover:bg-bamm-yellow/10 shadow-lg"
            >
              <Instagram size={20} strokeWidth={1.5} />
            </a>
            <a
              href={`tel:${info.phone}`}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white/5 rounded-full flex items-center justify-center text-bamm-yellow border border-white/10 active:scale-90 transition-all hover:bg-bamm-yellow/10 shadow-lg"
            >
              <Phone size={20} strokeWidth={1.5} />
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white/5 rounded-full flex items-center justify-center text-bamm-yellow border border-white/10 active:scale-90 transition-all hover:bg-bamm-yellow/10 shadow-lg"
            >
              <MapPin size={20} strokeWidth={1.5} />
            </a>
          </div>

          {/* Simple Details */}
          <div className="w-full space-y-4 sm:space-y-6 mb-6 sm:mb-10 px-2 shrink-0">
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Clock size={16} className="text-bamm-yellow" />
              <span className="text-[12px] font-bold tracking-widest uppercase">
                {info.hours}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin size={16} className="text-bamm-yellow" />
                <span className="text-[12px] font-bold tracking-widest uppercase">
                  {info.address.split(",")[0]}
                </span>
              </div>
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em]">
                {info.address.split(",").slice(1).join(",")}
              </span>
            </div>
          </div>

          {/* Wi-Fi Card */}
          <div className="w-full bg-white/[0.03] rounded-[24px] sm:rounded-[32px] border border-dashed border-white/10 p-4 sm:p-6 flex flex-col items-center relative overflow-hidden shrink-0 mt-auto">
            <div className="absolute top-0 right-0 w-32 h-32 bg-bamm-yellow/5 rounded-full blur-3xl pointer-events-none" />
            <Wifi size={24} className="text-bamm-yellow mb-4" />
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">
                  Wi-Fi:
                </span>
                <span className="text-[12px] font-black text-white uppercase tracking-[0.1em]">
                  {info.wifi.ssid}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">
                  Pass:
                </span>
                <span className="text-[12px] font-black text-white uppercase tracking-[0.1em]">
                  {info.wifi.pass}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Product Modal ---
export function ProductDetail({
  product,
  onClose,
}: {
  product: MenuItem | null;
  onClose: () => void;
}) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex flex-col overflow-hidden pointer-events-none max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
          onClick={onClose}
        />

        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            mass: 0.8,
          }}
          className="relative flex-1 flex flex-col mt-16 pointer-events-auto min-h-0 overflow-y-auto no-scrollbar"
        >
          {/* Red Header Background with Premium Curve */}
          <div className="absolute inset-x-0 top-0 h-[300px] bg-[#AD1519] rounded-t-[40px] shadow-2xl z-0" />

          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white z-20">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center backdrop-blur-md transition-colors"
              id="close-modal-btn"
            >
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center backdrop-blur-md transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Large Hero Graphic */}
          <div className="relative z-10 flex flex-col items-center pt-24 pb-12 shrink-0">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
              className="w-48 h-48 rounded-[48px] bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center relative shadow-[0_25px_40px_rgba(0,0,0,0.2)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-bamm-yellow/30 to-transparent rounded-[48px] opacity-20" />
              {product.image ? (
                <div className="absolute inset-0 w-full h-full p-2">
                  <div className="w-full h-full rounded-[40px] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-bamm-yellow flex items-center justify-center shadow-lg transform -translate-y-4">
                    {(() => {
                      const ProductIcon =
                        CATEGORY_ICONS[product.category] || Utensils;
                      return (
                        <ProductIcon
                          size={40}
                          className="text-black"
                          strokeWidth={2}
                        />
                      );
                    })()}
                  </div>
                  <span className="text-white font-black text-xl italic uppercase tracking-widest mt-2 px-6 text-center leading-none z-10">
                    {product.name}
                  </span>
                </>
              )}
            </motion.div>
          </div>

          {/* Premium Details Section */}
          <div className="relative z-10 flex-1 bg-[#F5F5F3] rounded-t-[50px] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] px-8 pt-10 flex flex-col mt-[-30px] min-h-[500px]">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#AD1519] bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-black text-[#AD1519]">
                {product.price}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-500 text-[13px] leading-[1.8] font-medium">
                {product.description}
                {
                  " Özenle seçilmiş malzemelerle hazırlanan bu eşsiz lezzet, her lokmada size BAMM Garden kalitesini hissettirmek üzere tasarlandı."
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
