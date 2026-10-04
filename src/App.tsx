import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageSquare, X } from "lucide-react";
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
  FeedbackModal,
} from "./components/Sections";
import { AdminPanel } from "./components/AdminPanel";
import { CAMPAIGNS, Campaign, MenuItem } from "./data";
import { db } from "./lib/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [menuInitialCategory, setMenuInitialCategory] = useState<
    string | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isCampaignPopupOpen, setIsCampaignPopupOpen] = useState(true);
  const [campaignPopupEnabled, setCampaignPopupEnabled] = useState(true);
  const [isStudentMode, setIsStudentMode] = useState(false);
  const [publicCampaigns, setPublicCampaigns] = useState<Campaign[]>(CAMPAIGNS.map((campaign, index) => ({ ...campaign, order: index * 10, isActive: true })));
  const campaignCloseRef = useRef<HTMLButtonElement>(null);
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
    const fallbackCampaigns = CAMPAIGNS.map((campaign, index) => ({ ...campaign, order: index * 10, isActive: true }));
    const sortCampaigns = (items: Campaign[]) => [...items]
      .filter((campaign) => !campaign.deleted && campaign.isActive !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    let campaignsUnsubscribe: (() => void) | undefined;
    let settingsUnsubscribe: (() => void) | undefined;
    try {
      campaignsUnsubscribe = onSnapshot(collection(db, "campaigns"), (snapshot) => {
        if (snapshot.empty) {
          setPublicCampaigns(sortCampaigns(fallbackCampaigns));
          return;
        }
        const rows = snapshot.docs.map((campaignDoc) => ({
          id: campaignDoc.id,
          ...campaignDoc.data(),
        })) as Campaign[];
        setPublicCampaigns(sortCampaigns(rows));
      }, () => {
        setPublicCampaigns(sortCampaigns(fallbackCampaigns));
      });

      settingsUnsubscribe = onSnapshot(doc(db, "settings", "campaigns"), (snapshot) => {
        setCampaignPopupEnabled(snapshot.exists() ? snapshot.data()?.popupEnabled !== false : true);
      }, () => {
        setCampaignPopupEnabled(true);
      });
    } catch (error) {
      console.warn("Kampanya ayarları yüklenemedi:", error);
    }

    return () => {
      campaignsUnsubscribe?.();
      settingsUnsubscribe?.();
    };
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

  useEffect(() => {
    if (!isCampaignPopupOpen || activeTab !== "home") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCampaignPopupOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    campaignCloseRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCampaignPopupOpen, activeTab]);

  useEffect(() => {
    if (activeTab !== "menu") {
      setIsStudentMode(false);
    }
  }, [activeTab]);

  const popupCampaign = publicCampaigns[0];

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
            onFeedbackClick={() => setIsFeedbackOpen(true)}
            isStudentMode={isStudentMode}
            onStudentModeChange={setIsStudentMode}
          />
        );
      case "events":
        return <EventsSection />;
      case "contact":
        return (
          <ContactSection
            onSearchClick={() => setIsSearchOpen(true)}
            onFeedbackClick={() => setIsFeedbackOpen(true)}
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
                src="https://i.ibb.co/3ytdjqqM/306337556-429892355877956-707020667180952216-n.jpg"
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
                  onFeedbackClick={() => setIsFeedbackOpen(true)}
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

            {/* Floating Anonymous Feedback Button */}
            {activeTab !== "admin" && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsFeedbackOpen(true)}
                className="fixed bottom-[88px] right-4 z-[90] bg-bamm-yellow text-black px-3.5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider shadow-[0_8px_25px_rgba(255,215,0,0.4)] border border-yellow-300 flex items-center gap-2 active:scale-95 hover:scale-105 transition-all cursor-pointer group"
                title="Görüş & Şikayet Bildir"
              >
                <div className="relative flex items-center justify-center">
                  <MessageSquare size={16} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </div>
                <span className="text-[11px] font-black italic tracking-tight">Görüş Bildir</span>
              </motion.button>
            )}

            <ProductDetail
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              isStudentMode={isStudentMode}
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

            <FeedbackModal
              isOpen={isFeedbackOpen}
              onClose={() => setIsFeedbackOpen(false)}
            />

            <AnimatePresence>
              {isCampaignPopupOpen && campaignPopupEnabled && activeTab === "home" && popupCampaign && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[180] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="campaign-popup-title"
                  onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                      setIsCampaignPopupOpen(false);
                    }
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 14 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 10 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="relative flex max-h-[calc(100dvh-4rem)] w-fit max-w-[min(92vw,420px)] flex-col overflow-hidden rounded-[24px] border border-white/15 bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.6)] sm:max-h-[calc(100dvh-6rem)] sm:max-w-[440px]"
                  >
                    <span id="campaign-popup-title" className="sr-only">
                      Yeni kampanya
                    </span>

                    <div className="absolute left-4 top-4 z-20 rounded-full bg-bamm-yellow px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-bamm-black shadow-lg">
                        {popupCampaign.badge || "YENİ KAMPANYA"}
                    </div>

                    <button
                      ref={campaignCloseRef}
                      type="button"
                      onClick={() => setIsCampaignPopupOpen(false)}
                      aria-label="Kampanya popup'ını kapat"
                      className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-bamm-yellow"
                    >
                      <X size={20} strokeWidth={2.5} />
                    </button>

                    <div className="flex min-h-0 flex-1 justify-center overflow-auto bg-[#111111]">
                      <img
                        src={popupCampaign.image || "/kampanya-ogrenci-indirimi.jpg"}
                        alt={popupCampaign.title}
                        className="block h-auto max-h-[58vh] w-auto max-w-full object-contain sm:max-h-[62vh]"
                      />
                    </div>

                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
