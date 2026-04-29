import { motion, AnimatePresence } from "motion/react";
import { Search, Heart, ChevronRight, MapPin, Phone, Instagram, Twitter, Clock, ExternalLink, Utensils, Zap, Dices, PartyPopper, Trophy, Star, Users, CheckCircle2, Coffee, Wine, Beer, Pizza, Sandwich, CupSoda, Beef, ChevronLeft, MoreVertical, Minus, Plus, Flame, Leaf, UtensilsCrossed, Cookie, ShoppingBag, ChevronDown, Share, X, Wifi } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { CATEGORIES, MENU_DATA, MenuItem, CAMPAIGNS, EVENTS } from "../data";
import { db } from "../lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

// --- Header ---
export function Header({ isLight, onSearchClick }: { isLight?: boolean, onSearchClick: () => void }) {
  return (
    <header className={`sticky top-0 z-[100] ${isLight ? 'bg-white/80 border-black/5' : 'bg-bamm-black/80 border-white/5'} backdrop-blur-md px-6 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 flex items-center justify-between border-b relative transition-colors duration-500`}>
      {/* Spacer to balance the layout */}
      <div className="w-20 opacity-0 pointer-events-none" />

      {/* Centered Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className={`w-14 h-14 ${isLight ? 'bg-white' : 'bg-bamm-black'} rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.15)] overflow-hidden border ${isLight ? 'border-black/5' : 'border-white/10'}`}>
          <img 
            src="https://i.hizliresim.com/guz3g2u.jpg" 
            alt="BAMM Garden Logo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      
      <div className="flex gap-2 relative z-10">
        <button 
          onClick={onSearchClick}
          className={`w-9 h-9 ${isLight ? 'bg-black/[0.03]' : 'bg-white/5'} rounded-full flex items-center justify-center border ${isLight ? 'border-black/5' : 'border-white/10'} ${isLight ? 'text-gray-400' : 'text-gray-400'} active:scale-95 transition-transform`}
        >
          <Search size={14} strokeWidth={1.5} />
        </button>
        <button className={`w-9 h-9 ${isLight ? 'bg-black/[0.03]' : 'bg-white/5'} rounded-full flex items-center justify-center border ${isLight ? 'border-black/5' : 'border-white/10'} ${isLight ? 'text-gray-400' : 'text-gray-300'} active:scale-95 transition-transform`}>
          <Heart size={14} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}

// --- Search Modal ---
export function SearchModal({ isOpen, onClose, onProductClick }: { isOpen: boolean, onClose: () => void, onProductClick: (item: MenuItem) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const results = query.trim() === "" ? [] : MENU_DATA.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) || 
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
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
                  <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">{item.category}</p>
                </div>
                <span className="text-bamm-yellow font-black italic">{item.price}</span>
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
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Popüler Aramalar</h3>
                <div className="flex flex-wrap gap-2">
                  {["Burger", "Kokteyl", "Pizza", "Kahvaltı"].map(pop => (
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
export function HomeSection({ onMenuClick, onSocialClick, onSearchClick }: { onMenuClick: (category?: string) => void, onSocialClick: () => void, onSearchClick: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10 pb-32"
    >
      {/* Hero Section - Edge to Edge */}
      <div className="relative h-[550px] overflow-hidden group shadow-2xl bg-black">
        <img 
          src="https://i.hizliresim.com/p4up7ax.jpg" 
          alt="BAMM Garden"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
        
        <div className="absolute bottom-10 left-0 px-8 w-full">
          <div className="flex items-center gap-4 p-5 bg-black/40 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl">
            <button 
              onClick={() => onMenuClick()}
              className="flex-1 bg-gradient-to-b from-bamm-yellow to-[#FACC15] text-bamm-black font-black py-4 rounded-2xl text-[11px] uppercase shadow-xl active:scale-[0.95] transition-all tracking-[0.2em]"
            >
              MENÜYÜ GÖR
            </button>
            <button 
              className="flex-1 bg-white/10 border border-white/20 text-white font-bold py-4 rounded-2xl text-[11px] uppercase active:scale-[0.95] transition-all tracking-[0.2em]"
              onClick={onSocialClick}
            >
              REZERVASYON
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns Section - With Padding */}
      <div className="space-y-4 px-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold italic uppercase tracking-tight">Kampanyalar</h2>
          </div>
          <button className="text-gray-500 text-[9px] font-black tracking-widest uppercase active:text-white transition-colors">TÜMÜ</button>
        </div>
        
        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[420px]">
          {/* Featured Large Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => onMenuClick(CAMPAIGNS[0].category)}
            className="row-span-2 relative rounded-[32px] overflow-hidden group border border-white/5 shadow-2xl cursor-pointer active:scale-[0.98] transition-transform"
          >
            <img 
              src={CAMPAIGNS[0].image} 
              alt={CAMPAIGNS[0].title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bamm-black via-bamm-black/20 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <div className="bg-white/10 backdrop-blur-md w-fit px-2 py-0.5 rounded-sm mb-3 border border-white/10">
                <span className="text-[7px] font-black text-white uppercase tracking-widest">ÖNE ÇIKAN</span>
              </div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-[0.85] mb-3">
                {CAMPAIGNS[0].title}
              </h3>
              <p className="text-gray-300 text-[10px] font-medium uppercase tracking-wider leading-relaxed opacity-80 mb-4 line-clamp-3">
                {CAMPAIGNS[0].description}
              </p>
              <div className="w-fit flex items-center gap-1.5 bg-bamm-yellow text-bamm-black px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                İNCELE <ChevronRight size={12} />
              </div>
            </div>
          </motion.div>

          {/* Smaller Cards */}
          {CAMPAIGNS.slice(1).map((campaign, i) => (
            <motion.div 
              key={campaign.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              onClick={() => onMenuClick(campaign.category)}
              className="relative rounded-[32px] overflow-hidden group border border-white/5 shadow-xl cursor-pointer active:scale-[0.98] transition-transform"
            >
              <img 
                src={campaign.image} 
                alt={campaign.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bamm-black/90 via-bamm-black/40 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h3 className="text-xs font-black text-white italic uppercase tracking-widest leading-none mb-1">
                  {campaign.title}
                </h3>
                <div className="w-4 h-0.5 bg-bamm-yellow rounded-full transition-all duration-300 group-hover:w-8" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-bold italic uppercase tracking-tight">Kategoriler</h2>
          <button onClick={onMenuClick} className="text-bamm-yellow text-[9px] font-black tracking-[0.2em] uppercase border-b border-bamm-yellow/20 pb-0.5">Tümünü Gör</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-6">
          {[
            { name: "Kokteyl", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600", color: "#A855F7" },
            { name: "Burger", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600", color: "#F97316" },
            { name: "Kahvaltı", img: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&q=80&w=600", color: "#06B6D4" },
            { name: "Pizza", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600", color: "#EF4444" },
            { name: "Bira", img: "https://images.unsplash.com/photo-1532634896-26909d0d4b89?auto=format&fit=crop&q=80&w=600", color: "#EAB308" },
            { name: "Kahve", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600", color: "#D97706" },
          ].map((cat, i) => (
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
                src={cat.img} 
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
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold italic uppercase tracking-tight">Popüler Lezzetler</h2>
          <button onClick={onMenuClick} className="text-bamm-yellow text-[9px] font-black tracking-widest uppercase border-b border-bamm-yellow/20 pb-0.5">Tümünü Gör</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
          {MENU_DATA.filter(i => i.isPopular).map((item) => {
            const ItemIcon = CATEGORY_ICONS[item.category] || Utensils;
            
            return (
            <div key={item.id} className="min-w-[200px] bg-gradient-to-br from-bamm-anthracite to-[#13151A] rounded-3xl p-5 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative overflow-hidden group cursor-pointer hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-bamm-yellow/5 rounded-full blur-2xl group-hover:bg-bamm-yellow/10 transition-colors duration-500 pointer-events-none" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-[52px] h-[52px] rounded-[18px] bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:bg-bamm-yellow/10 transition-all duration-300">
                  <ItemIcon size={24} className="text-gray-400 group-hover:text-bamm-yellow transition-colors" strokeWidth={1.5} />
                </div>
                <div className="bg-bamm-yellow/10 border border-bamm-yellow/20 px-2.5 py-1 rounded-full flex items-center gap-1 group-hover:bg-bamm-yellow group-hover:border-bamm-yellow group-hover:shadow-[0_4px_12px_rgba(255,204,0,0.3)] transition-all duration-300">
                  <Star size={10} className="text-[#B38F00] group-hover:text-black transition-colors" fill="currentColor" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B38F00] group-hover:text-black transition-colors">Popüler</span>
                </div>
              </div>

              <div className="mb-4 relative z-10">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-1">{CATEGORY_LABELS[item.category] || item.category}</span>
                <h3 className="font-black text-white text-[15px] truncate leading-tight transition-colors">{item.name}</h3>
                <p className="text-[11px] text-gray-400 line-clamp-1 mt-1 leading-relaxed">{item.description}</p>
              </div>

              <div className="flex justify-between items-center relative z-10 pt-2 border-t border-white/5">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-black text-white tracking-tighter">
                    {item.price.replace(' TL', '')}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">TL</span>
                </div>
                
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-bamm-yellow group-hover:text-black transition-colors duration-300">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>

      {/* Social Media Footer */}
      <div className="pt-10 pb-8 mt-4 mx-[-24px] px-6 flex flex-col items-center justify-center border-t border-black/[0.04]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-[1px] bg-black/10"></div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Bizi Takip Et</h3>
          <div className="w-10 h-[1px] bg-black/10"></div>
        </div>
        <div className="flex items-center gap-5">
          <a href="#" className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center text-gray-800 shadow-[0_8px_16px_rgba(0,0,0,0.04)] border border-black/[0.02] hover:-translate-y-1.5 hover:bg-black hover:text-white hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] active:scale-95 transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform duration-300"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
          </a>
          <a href="#" className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center text-gray-800 shadow-[0_8px_16px_rgba(0,0,0,0.04)] border border-black/[0.02] hover:-translate-y-1.5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:shadow-[0_12px_24px_rgba(220,39,67,0.25)] active:scale-95 transition-all duration-300 group">
            <Instagram size={22} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-300" />
          </a>
          <a href="#" className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center text-gray-800 shadow-[0_8px_16px_rgba(0,0,0,0.04)] border border-black/[0.02] hover:-translate-y-1.5 hover:bg-black hover:text-white hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] active:scale-95 transition-all duration-300 group">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="group-hover:scale-110 transition-transform duration-300"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.28A6.35 6.35 0 0 0 15.82 17l.01-10.3a8.21 8.21 0 0 0 5 1.78V5.04a5.07 5.07 0 0 1-1.24.15 4.9 4.9 0 0 1 0 1.5z" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// --- PWA Install Modal ---
export function PwaInstallModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
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
                Tarayıcı menüsünden <span className="text-white font-bold">"Ana Ekrana Ekle"</span> diyerek ana ekranınıza ekleyin.
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
  "Popüler": Star,
  "Kahvaltı": Coffee,
  "Atıştırmalıklar": Zap,
  "Tost & Sandviç": Sandwich,
  "Dürümler & Bowl": Beef,
  "Burgerler": Utensils,
  "Pizzalar": Pizza,
  "Makarnalar": Flame,
  "Salatalar": Leaf,
  "Ana Yemekler": UtensilsCrossed,
  "Tatlılar": Cookie,
  "Kokteyller": Wine,
  "Biralar": Beer,
  "Sıcak İçecekler": Coffee,
  "Soğuk İçecekler": CupSoda,
  "Alkoller": Wine,
};

const CATEGORY_LABELS: Record<string, string> = {
  "Popüler": "POPÜLER",
  "Kahvaltı": "KAHVALTI",
  "Atıştırmalıklar": "ATIŞTIR",
  "Tost & Sandviç": "TOST",
  "Dürümler & Bowl": "DÜRÜM",
  "Burgerler": "BURGER",
  "Pizzalar": "PİZZA",
  "Makarnalar": "MAKARNA",
  "Salatalar": "SALATA",
  "Ana Yemekler": "A.YEMEK",
  "Tatlılar": "TATLILAR",
  "Kokteyller": "KOKTEYL",
  "Biralar": "BİRA",
  "Sıcak İçecekler": "SICAK",
  "Soğuk İçecekler": "SOĞUK",
  "Alkoller": "ALKOLLER",
};

// --- Menu Section ---
export function MenuSection({ onProductClick, onSearchClick, initialCategory }: { onProductClick: (item: MenuItem) => void, onSearchClick: () => void, initialCategory?: string }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredItems = MENU_DATA.filter(item => {
    const matchesCategory = selectedCategory === "Popüler" ? item.isPopular : item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen flex flex-col"
    >
      {/* White Top Header Area */}
      <div className="bg-white pt-6 pb-8">
        <div className="px-6 flex items-center justify-between mb-8">
          <button className="w-10 h-10 flex items-center justify-center text-gray-900 hover:scale-110 transition-transform bg-gray-50 rounded-full">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="w-1.5 h-1.5 bg-gray-900 rounded-sm" />
              <div className="w-1.5 h-1.5 bg-gray-900 rounded-sm" />
              <div className="w-1.5 h-1.5 bg-gray-900 rounded-sm" />
              <div className="w-1.5 h-1.5 bg-gray-900 rounded-sm" />
            </div>
          </button>

          <div className="flex flex-col items-center justify-center">
            <span className="text-xl font-black tracking-widest text-bamm-black uppercase">MENÜ</span>
          </div>

          <button 
            onClick={onSearchClick}
            className="w-10 h-10 flex items-center justify-center text-gray-900 hover:scale-110 transition-transform bg-gray-50 rounded-full"
          >
            <Search size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Campaign / Happy Hour Banner */}
        <div className="px-6 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[72px] rounded-2xl overflow-hidden flex items-center shadow-[0_8px_16px_rgba(0,0,0,0.08)] cursor-pointer active:scale-[0.98] transition-transform"
          >
            <img 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" 
              alt="Happy Hour"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bamm-black/90 via-bamm-black/70 to-black/20" />
            <div className="relative z-10 px-4 flex items-center gap-3 w-full">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-bamm-yellow to-[#EAB308] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                <Clock size={16} className="text-bamm-black" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-bamm-yellow text-[9px] font-black uppercase tracking-[0.2em]">HAPPY HOUR</h3>
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-white text-[9px] font-bold tracking-widest">17:00 - 19:00</span>
                </div>
                <p className="text-white text-xs font-bold leading-tight tracking-tight">Tüm kokteyllerde <span className="text-bamm-yellow italic">%20 İNDİRİM!</span></p>
              </div>
              <ChevronRight size={16} className="text-white/40 shrink-0" />
            </div>
          </motion.div>
        </div>

        <div className="px-6">
          <h1 className="text-[40px] leading-none font-black text-gray-900 tracking-tight mb-2">Favoriler</h1>
          <p className="text-gray-500 font-medium text-sm">En sevilen lezzetler burada.</p>
        </div>
      </div>

      {/* Yellow Body Area */}
      <div className="bg-bamm-yellow rounded-t-[40px] pt-6 flex-1 flex flex-col relative shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-6 shrink-0">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const Icon = CATEGORY_ICONS[cat] || Utensils;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex flex-col items-center justify-end h-[116px] min-w-[84px] transition-all group"
              >
                <div className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                  ? "w-[80px] h-[80px] bg-black text-white shadow-2xl mb-3" 
                  : "w-[64px] h-[64px] bg-white/40 text-black group-hover:bg-white/60 mb-3"
                }`}>
                  <Icon size={isActive ? 28 : 22} strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                  isActive ? "text-black" : "text-black/60"
                }`}>
                  {CATEGORY_LABELS[cat] || cat.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product List - Horizontal Cards */}
        <div className="bg-[#F8F9FA] flex-1 rounded-t-[40px] px-6 pt-8 pb-32 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => {
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
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ItemIcon size={28} className="text-gray-400 group-hover:text-black transition-colors" strokeWidth={1.5} />
                  )}
                  
                  {item.isPopular && (
                    <div className="absolute -top-2 -right-2 bg-bamm-yellow text-black p-1.5 rounded-xl shadow-sm rotate-12 group-hover:rotate-0 transition-transform">
                      <Star size={10} fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center pb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">{CATEGORY_LABELS[item.category] || item.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight mb-2 pr-4">{item.name}</h3>
                  <p className="text-[11px] text-gray-500 line-clamp-1 leading-relaxed max-w-[90%]">{item.description}</p>
                </div>

                <div className="flex flex-col items-end gap-3 pl-2 relative z-10 flex-shrink-0">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[22px] font-black text-gray-900 tracking-tighter">
                      {item.price.replace(' TL', '')}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">TL</span>
                  </div>
                  <div className="w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center shadow-md opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 absolute -right-2 bottom-0">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </motion.div>
            )})}
          </AnimatePresence>
        
        {filteredItems.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <div className="text-gray-200 flex justify-center"><Search size={48} strokeWidth={1} /></div>
            <p className="text-gray-400 font-medium">Buralar biraz sessiz...</p>
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
      className="px-6 space-y-6 pb-32"
    >
      <h2 className="text-xl font-bold">Özel Kampanyalar</h2>
      {CAMPAIGNS.map(campaign => (
        <div key={campaign.id} className="bg-gradient-to-br from-bamm-anthracite to-bamm-black border border-bamm-yellow/20 rounded-3xl overflow-hidden relative group">
          <div className="p-6 relative z-10">
            <span className="bg-bamm-yellow text-bamm-black px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4 inline-block">Fırsat Paneli</span>
            <h3 className="text-lg font-bold mb-2 group-hover:text-bamm-yellow transition-colors">{campaign.title}</h3>
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
      className="px-6 space-y-6 pb-32"
    >
      <h2 className="text-xl font-bold">Yaklaşan Etkinlikler</h2>
      <div className="space-y-4">
        {EVENTS.map(event => (
          <div key={event.id} className="flex gap-4 p-4 bg-bamm-anthracite/30 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="w-14 flex-shrink-0 flex flex-col items-center justify-center bg-bamm-anthracite rounded-xl py-2 border border-white/5">
              <span className="text-[10px] uppercase font-black text-gray-500">{event.date.split(' ')[2]}</span>
              <span className="text-lg font-black text-bamm-yellow">{event.date.split(' ')[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase mb-1">
                <Clock size={10} /> {event.time}
              </div>
              <h3 className="font-bold text-sm mb-1 truncate">{event.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-1">{event.description}</p>
            </div>
            <button className="self-center p-2 bg-white/5 rounded-full">
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
      <div className="bg-bamm-yellow/5 border border-bamm-yellow/20 p-6 rounded-2xl text-center">
        <p className="text-xs font-bold text-bamm-yellow uppercase tracking-widest mb-2">Özel Organizasyonlar</p>
        <p className="text-sm text-gray-300 px-4">Doğum günü, parti ve özel geceleriniz için bizimle iletişime geçin.</p>
      </div>
    </motion.div>
  );
}

// --- Info / Contact Modal ---
export function InfoModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const info = {
    name: "BAMM GARDEN & NIGHT",
    tagline: "Garden & Night Experience",
    phone: "+90 216 000 00 00",
    instagram: "@bammgarden",
    address: "Bursa, Görükle",
    hours: "Her Gün: 08:00 - 02:00",
    wifi: {
      ssid: "BAMMGarden_Guest",
      pass: "bamm2025"
    }
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
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-6 pointer-events-none"
          >
            <div className="bg-[#1C1C1E] w-full max-w-sm rounded-[40px] border border-bamm-yellow/30 shadow-[0_32px_64px_rgba(0,0,0,0.8)] relative overflow-y-auto max-h-[90vh] no-scrollbar pointer-events-auto p-6 sm:p-8 flex flex-col items-center">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/40 active:scale-95 transition-all border border-white/5"
              >
                <X size={20} />
              </button>

              {/* Logo/Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-bamm-yellow/20 to-transparent p-1 mb-4 sm:mb-6 mt-2 border border-bamm-yellow/10 shrink-0">
                <div className="w-full h-full rounded-full bg-bamm-black overflow-hidden border-2 border-bamm-yellow/20 shadow-[0_0_40px_rgba(255,215,0,0.15)]">
                  <img 
                    src="https://i.hizliresim.com/guz3g2u.jpg" 
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
                  href={`https://instagram.com/${info.instagram.replace('@', '')}`}
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
                  <span className="text-[12px] font-bold tracking-widest uppercase">{info.hours}</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin size={16} className="text-bamm-yellow" />
                    <span className="text-[12px] font-bold tracking-widest uppercase">
                      {info.address.split(',')[0]}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em]">
                    {info.address.split(',').slice(1).join(',')}
                  </span>
                </div>
              </div>

              {/* Wi-Fi Card */}
              <div className="w-full bg-white/[0.03] rounded-[24px] sm:rounded-[32px] border border-dashed border-white/10 p-4 sm:p-6 flex flex-col items-center relative overflow-hidden shrink-0 mt-auto">
                <div className="absolute top-0 right-0 w-32 h-32 bg-bamm-yellow/5 rounded-full blur-3xl pointer-events-none" />
                <Wifi size={24} className="text-bamm-yellow mb-4" />
                <div className="space-y-1 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">Wi-Fi:</span>
                    <span className="text-[12px] font-black text-white uppercase tracking-[0.1em]">{info.wifi.ssid}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">Pass:</span>
                    <span className="text-[12px] font-black text-white uppercase tracking-[0.1em]">{info.wifi.pass}</span>
                  </div>
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
export function ContactSection({ onSearchClick }: { onSearchClick: () => void }) {
  const info = {
    name: "BAMM GARDEN & NIGHT",
    tagline: "Garden & Night Experience",
    phone: "+90 216 000 00 00",
    instagram: "@bammgarden",
    address: "Bursa, Görükle",
    hours: "Her Gün: 08:00 - 02:00",
    wifi: {
      ssid: "BAMMGarden_Guest",
      pass: "bamm2025"
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#111216] min-h-screen pb-32 flex flex-col"
    >
      <Header isLight={true} onSearchClick={onSearchClick} />

      <div className="flex flex-col items-center pt-8 px-6">
        <div className="text-center mb-8 w-full">
          <h2 className="text-[52px] leading-none font-black text-white tracking-tighter">
            iletişim<span className="text-[#FACC15]">.</span>
          </h2>
          <p className="text-[#8BA5BE] font-medium text-[15px]">Bizimle kolayca iletişime geçin.</p>
        </div>

        <div className="w-full max-w-sm rounded-[40px] border border-bamm-yellow/30 shadow-[0_32px_64px_rgba(0,0,0,0.8)] relative overflow-hidden bg-[#1C1C1E] p-6 sm:p-8 flex flex-col items-center">
          {/* Logo/Image */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-bamm-yellow/20 to-transparent p-1 mb-4 sm:mb-6 mt-2 shrink-0 border border-bamm-yellow/10">
            <div className="w-full h-full rounded-full bg-bamm-black overflow-hidden border-2 border-bamm-yellow/20 shadow-[0_0_40px_rgba(255,215,0,0.15)] flex items-center justify-center">
              <img 
                src="https://i.hizliresim.com/guz3g2u.jpg" 
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
              href={`https://instagram.com/${info.instagram.replace('@', '')}`}
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
              <span className="text-[12px] font-bold tracking-widest uppercase">{info.hours}</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin size={16} className="text-bamm-yellow" />
                <span className="text-[12px] font-bold tracking-widest uppercase">
                  {info.address.split(',')[0]}
                </span>
              </div>
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em]">
                {info.address.split(',').slice(1).join(',')}
              </span>
            </div>
          </div>

          {/* Wi-Fi Card */}
          <div className="w-full bg-white/[0.03] rounded-[24px] sm:rounded-[32px] border border-dashed border-white/10 p-4 sm:p-6 flex flex-col items-center relative overflow-hidden shrink-0 mt-auto">
            <div className="absolute top-0 right-0 w-32 h-32 bg-bamm-yellow/5 rounded-full blur-3xl pointer-events-none" />
            <Wifi size={24} className="text-bamm-yellow mb-4" />
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">Wi-Fi:</span>
                <span className="text-[12px] font-black text-white uppercase tracking-[0.1em]">{info.wifi.ssid}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">Pass:</span>
                <span className="text-[12px] font-black text-white uppercase tracking-[0.1em]">{info.wifi.pass}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Product Modal ---
export function ProductDetail({ product, onClose }: { product: MenuItem | null, onClose: () => void }) {
  const [crossSellProduct, setCrossSellProduct] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (product) {
       const others = MENU_DATA.filter(m => m.id !== product.id && m.isPopular);
       const random = others[Math.floor(Math.random() * Math.max(1, others.length))] || others[0];
       setCrossSellProduct(random || null);
    }
  }, [product]);

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
          transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
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
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-bamm-yellow flex items-center justify-center shadow-lg transform -translate-y-4">
                     {(() => {
                        const ProductIcon = CATEGORY_ICONS[product.category] || Utensils;
                        return <ProductIcon size={40} className="text-black" strokeWidth={2} />;
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
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{product.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#AD1519] bg-red-50 px-2 py-0.5 rounded-full border border-red-100">{product.category}</span>
                </div>
              </div>
              <div className="text-2xl font-black text-[#AD1519]">
                {product.price}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-500 text-[13px] leading-[1.8] font-medium">
                {product.description}
                {" Özenle seçilmiş malzemelerle hazırlanan bu eşsiz lezzet, her lokmada size BAMM Garden kalitesini hissettirmek üzere tasarlandı."}
              </p>
            </div>

            {/* Cross Sell */}
            {crossSellProduct && (
              <div className="mt-4 border-t border-black/[0.04] pt-6 mb-10 pb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={14} className="text-bamm-yellow fill-bamm-yellow" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 leading-none">Birlikte Gider</h3>
                </div>
                
                <div className="bg-white p-3 rounded-[20px] flex items-center gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-black/[0.03]">
                  <div className="w-[52px] h-[52px] rounded-xl bg-gray-50 overflow-hidden relative shrink-0">
                    {crossSellProduct.image ? (
                      <img src={crossSellProduct.image} alt={crossSellProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Flame size={20} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-gray-900 truncate mb-0.5">{crossSellProduct.name}</h4>
                    <p className="text-[11px] font-bold text-[#AD1519]">{crossSellProduct.price}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
