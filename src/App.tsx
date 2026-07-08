import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import BottomNav from "./components/BottomNav";
import {
  Header,
  HomeSection,
  MenuSection,
  EventsSection,
  ContactSection,
  ProductDetail,
  SearchModal,
  InfoModal,
} from "./components/Sections";
import { AdminPanel } from "./components/AdminPanel";
import { MenuItem } from "./data";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [menuInitialCategory, setMenuInitialCategory] = useState<
    string | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Function to navigate to menu with a specific category
  const navigateToMenu = (category?: string) => {
    setMenuInitialCategory(category);
    setActiveTab("menu");
  };

  // Simulate premium loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setActiveTab('admin');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const renderSection = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeSection
            onMenuClick={navigateToMenu}
            onSearchClick={() => setIsSearchOpen(true)}
            onSocialClick={() => setIsInfoOpen(true)}
          />
        );
      case "menu":
        return (
          <MenuSection
            onProductClick={(item) => setSelectedProduct(item)}
            onSearchClick={() => setIsSearchOpen(true)}
            onBackClick={() => setActiveTab("home")}
            initialCategory={menuInitialCategory}
          />
        );
      case "events":
        return <EventsSection />;
      case "contact":
        return (
          <ContactSection
            onSearchClick={() => setIsSearchOpen(true)}
          />
        );
      case "admin":
        return <AdminPanel />;
      default:
        return (
          <HomeSection
            onMenuClick={() => setActiveTab("menu")}
            onSearchClick={() => setIsSearchOpen(true)}
            onSocialClick={() => setIsInfoOpen(true)}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen ${activeTab === "menu" ? "bg-white" : activeTab === "contact" ? "bg-[#F5F5F3]" : "bg-bamm-black"} flex flex-col w-full max-w-none mx-auto relative transition-colors duration-500 overflow-x-hidden`}
    >
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-bamm-black flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
              className="w-32 h-32 bg-bamm-black rounded-full flex items-center justify-center mb-10 overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.1)]"
            >
              <img
                src="https://i.hizliresim.com/guz3g2u.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-full h-full bg-bamm-yellow"
              />
            </div>
          </motion.div>
        ) : (
          <>
            <main ref={mainRef} className="flex-1 overflow-y-auto no-scrollbar relative">
              {activeTab !== "menu" && (
                <Header
                  isLight={["contact", "menu"].includes(activeTab)}
                  onSearchClick={() => setIsSearchOpen(true)}
                  onLogoClick={scrollToTop}
                />
              )}

              <div className="pt-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderSection()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Salera Digital Signature */}
              <footer 
                className="py-20 mt-auto text-center opacity-30 hover:opacity-100 transition-opacity duration-1000 group cursor-default"
                onClick={(e) => {
                  if (e.detail === 5) {
                    window.location.hash = 'admin';
                  }
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-12 h-[1px] transition-all duration-1000 group-hover:w-20 ${["menu", "contact"].includes(activeTab) ? "bg-gray-200" : "bg-white/10"}`} />
                  <p className={`text-[8px] font-black tracking-[0.5em] uppercase leading-relaxed ${["menu", "contact"].includes(activeTab) ? "text-gray-400" : "text-gray-500"}`}>
                    Digital Experience & Development <br/>
                    <span className={`text-[10px] sm:text-[11px] mt-2 inline-block tracking-[0.3em] transition-colors ${["menu", "contact"].includes(activeTab) ? "text-gray-900" : "text-white"}`}>
                      SALERA DIGITAL
                    </span>
                  </p>
                  <div className={`w-1 h-1 rounded-full ${["menu", "contact"].includes(activeTab) ? "bg-bamm-yellow" : "bg-bamm-yellow"} opacity-40`} />
                </div>
              </footer>
            </main>

            <BottomNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isLight={["menu"].includes(activeTab)}
              onInfoClick={() => setIsInfoOpen(true)}
            />

            <ProductDetail
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />

            <SearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onProductClick={(item) => setSelectedProduct(item)}
            />

            <InfoModal
              isOpen={isInfoOpen}
              onClose={() => setIsInfoOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
