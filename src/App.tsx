import { useState, useEffect } from "react";
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
  PwaInstallModal,
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
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  // Function to navigate to menu with a specific category
  const navigateToMenu = (category?: string) => {
    setMenuInitialCategory(category);
    setActiveTab("menu");
  };

  // Simulate premium loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsPwaModalOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
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
            onAdminClick={() => setActiveTab("admin")}
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
      className={`min-h-screen ${activeTab === "menu" ? "bg-white" : activeTab === "contact" ? "bg-[#F5F5F3]" : "bg-bamm-black"} flex flex-col max-w-lg mx-auto relative shadow-2xl transition-colors duration-500 overflow-x-hidden`}
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
            <main className="flex-1 overflow-y-auto no-scrollbar relative">
              {activeTab !== "menu" && (
                <Header
                  isLight={["contact", "menu"].includes(activeTab)}
                  onSearchClick={() => setIsSearchOpen(true)}
                  onAdminClick={activeTab !== "admin" ? () => setActiveTab("admin") : undefined}
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

            <PwaInstallModal
              isOpen={isPwaModalOpen}
              onClose={() => setIsPwaModalOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
