import { motion } from "motion/react";
import { Home, Utensils, Crown, Info } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLight?: boolean;
  onInfoClick?: () => void;
}

export default function BottomNav({ activeTab, setActiveTab, onInfoClick }: BottomNavProps) {
  if (activeTab === "admin") return null;

  const tabs = [
    { id: "home", icon: Home },
    { id: "menu", icon: Utensils },
    { id: "contact", icon: Info },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-2 flex justify-center pointer-events-none">
      <div className="bg-[#18181A] rounded-[32px] px-8 py-3 flex justify-between items-center gap-12 shadow-2xl border border-white/5 pointer-events-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'contact' && onInfoClick) {
                  onInfoClick();
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center tap-highlight-none transition-all h-10 w-10`}
              id={`nav-btn-${tab.id}`}
            >
              <div className={`relative z-10 transition-colors duration-300 ${
                isActive ? "text-[#FFB800]" : "text-[#888888] hover:text-gray-300"
              }`}>
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={isActive ? "" : "opacity-80"} 
                />
              </div>
              
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -bottom-2 w-1.5 h-1.5 bg-[#FFB800] rounded-full shadow-[0_0_8px_rgba(255,184,0,0.8)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
