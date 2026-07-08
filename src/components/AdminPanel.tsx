import { useState, useEffect, useMemo, FormEvent } from "react";
import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  getDocs,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { CATEGORIES, MENU_DATA, MenuItem } from "../data";
import { 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Nfc, 
  ChevronDown, 
  Search, 
  LayoutDashboard, 
  Utensils, 
  Settings, 
  AlertCircle,
  CheckCircle2,
  X,
  Star,
  Lock,
  Image as ImageIcon,
  Upload,
  ArrowUp,
  ArrowDown,
  FolderOpen,
  WifiOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress as jpeg with 0.75 quality for balanced sharpness
        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, shouldThrow: boolean = true) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  if (shouldThrow) {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } else {
    console.warn('Firestore Error (Gracefully handled): ', JSON.stringify(errInfo));
  }
}

export function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<MenuItem[]>(MENU_DATA);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [nfcStatus, setNfcStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "categories" | "settings">("products");
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; order: number; description?: string; image?: string; deleted?: boolean }[]>([]);
  const [editingCategory, setEditingCategory] = useState<{ id: string | null; name: string; description: string; order: number; image?: string } | null>(null);
  const [categoryImageSourceTab, setCategoryImageSourceTab] = useState<"upload" | "url">("upload");
  const [categoryImageUploadLoading, setCategoryImageUploadLoading] = useState(false);
  const [categoryImageUploadError, setCategoryImageUploadError] = useState("");
  const [categorySaveError, setCategorySaveError] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<{ id: string; name: string } | null>(null);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  const availableCategories = dbCategories.length > 0 ? dbCategories.map(c => c.name) : CATEGORIES;

  const [showCustomSubcategoryInput, setShowCustomSubcategoryInput] = useState(false);

  const currentCategorySubcategories = useMemo(() => {
    if (!editForm.category) return [];
    return (Array.from(
      new Set(
        products
          .filter((p) => p.category === editForm.category && p.subcategory)
          .map((p) => p.subcategory as string)
      )
    ) as string[]).sort((a, b) => a.localeCompare(b));
  }, [products, editForm.category]);

  const [imageSourceTab, setImageSourceTab] = useState<"upload" | "url">("upload");
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    let unsub: (() => void) | undefined;
    try {
      unsub = onSnapshot(collection(db, "products"), (snap) => {
        if (!snap.empty) {
          const dbProducts = snap.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as any,
          );
          
          const merged = [...MENU_DATA];
          dbProducts.forEach((dbP) => {
            const idx = merged.findIndex((m) => m.id === dbP.id);
            if (idx !== -1) merged[idx] = dbP;
            else merged.push(dbP);
          });

          setProducts(merged.filter(p => !p.deleted));
        } else {
          setProducts(MENU_DATA);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, "products", false);
        setFirestoreError("Veritabanı kotası doldu veya bağlantı hatası oluştu. Çevrimdışı yedek veriler gösteriliyor.");
        if (unsub) {
          try {
            unsub();
          } catch (e) {
            console.warn("Error trying to unsubscribe from products on error in AdminPanel: ", e);
          }
        }
      });
    } catch (e) {
      console.warn("Failed to initialize products subscription in AdminPanel: ", e);
      setFirestoreError("Veritabanı bağlantı hatası oluştu.");
    }
    return () => {
      if (unsub) {
        try {
          unsub();
        } catch (e) {
          console.warn("Error in products unsubscribe cleanup in AdminPanel: ", e);
        }
      }
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let unsub: (() => void) | undefined;
    try {
      unsub = onSnapshot(collection(db, "categories"), (snap) => {
        if (!snap.empty) {
          const cats = snap.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as any,
          );
          setDbCategories(cats.filter(c => !c.deleted).sort((a,b) => (a.order ?? 0) - (b.order ?? 0)));
        } else {
          setDbCategories([]);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, "categories", false);
        setFirestoreError("Veritabanı kotası doldu veya bağlantı hatası oluştu. Çevrimdışı yedek veriler gösteriliyor.");
        if (unsub) {
          try {
            unsub();
          } catch (e) {
            console.warn("Error trying to unsubscribe from categories on error in AdminPanel: ", e);
          }
        }
      });
    } catch (e) {
      console.warn("Failed to initialize categories subscription in AdminPanel: ", e);
      setFirestoreError("Veritabanı bağlantı hatası oluştu.");
    }
    return () => {
      if (unsub) {
        try {
          unsub();
        } catch (e) {
          console.warn("Error in categories unsubscribe cleanup in AdminPanel: ", e);
        }
      }
    };
  }, [user]);

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (usernameInput !== "bamm" || passwordInput !== "bamm1616") {
      setLoginError("Kullanıcı adı veya şifre hatalı.");
      return;
    }

    try {
      const dummyEmail = "bamm@admin.com";
      const dummyPassword = passwordInput + "Secure";

      try {
        await signInWithEmailAndPassword(auth, dummyEmail, dummyPassword);
      } catch (signInErr: any) {
        if (signInErr.code === "auth/user-not-found" || signInErr.code === "auth/invalid-credential") {
          try {
            await createUserWithEmailAndPassword(auth, dummyEmail, dummyPassword);
          } catch (createErr: any) {
            setLoginError("Sistem hatası. Lütfen daha sonra deneyin.");
          }
        } else {
          setLoginError("Giriş başarısız oldu.");
        }
      }
    } catch (error) {
      setLoginError("Bilinmeyen bir hata oluştu.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const clearMenuCaches = () => {
    try {
      localStorage.removeItem("bamm_categories_cache");
      localStorage.removeItem("bamm_categories_cache_time");
      localStorage.removeItem("bamm_products_cache");
      localStorage.removeItem("bamm_products_cache_time");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    try {
      const cleanData: any = {};
      Object.keys(editForm).forEach((key) => {
        if ((editForm as any)[key] !== undefined) {
          cleanData[key] = (editForm as any)[key];
        }
      });

      if (isEditing === "new") {
        await addDoc(collection(db, "products"), {
          ...cleanData,
          isPopular: cleanData.isPopular || false,
        });
      } else if (isEditing) {
        const ref = doc(db, "products", isEditing);
        await setDoc(ref, cleanData, { merge: true });
      }
      setIsEditing(null);
      setEditForm({});
      clearMenuCaches();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "products");
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      await setDoc(doc(db, "products", id), { deleted: true }, { merge: true });
      setIsDeleting(null);
      clearMenuCaches();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `products/${id}`);
    }
  };

  const seedDefaultCategories = async () => {
    setIsSeeding(true);
    try {
      const CATEGORIES_TO_SEED = [
        "Kampanyalar", "Yemekler", "Kadeh", "Şişeler", "Şarap", "Kokteyller", "Alkolsüz Kokteyller", "Biralar", "Shotlar", "Popüler", "Kahvaltı", "Kahveler", "Soğuk Kahveler", "Çaylar", "Atıştırmalıklar", "Salatalar", "Tatlılar", "Soğuk İçecekler", "Soft İçecekler"
      ];
      const SEED_DESCS: Record<string, string> = {
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

      for (let i = 0; i < CATEGORIES_TO_SEED.length; i++) {
        const catName = CATEGORIES_TO_SEED[i];
        const id = catName.toLowerCase()
          .replace(/ğ/g, "g")
          .replace(/ü/g, "u")
          .replace(/ş/g, "s")
          .replace(/ı/g, "i")
          .replace(/ö/g, "o")
          .replace(/ç/g, "c")
          .replace(/[^a-z0-9]/g, "-");
        
        await setDoc(doc(db, "categories", id), {
          id,
          name: catName,
          order: i * 10,
          description: SEED_DESCS[catName] || "Bamm Garden Lezzetleri",
          deleted: false
        });
      }
      clearMenuCaches();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "categories");
    } finally {
      setIsSeeding(false);
    }
  };

  const moveCategory = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= dbCategories.length) return;

    const cat1 = dbCategories[index];
    const cat2 = dbCategories[targetIndex];

    try {
      const tempOrder = cat1.order;
      await setDoc(doc(db, "categories", cat1.id), { order: cat2.order }, { merge: true });
      await setDoc(doc(db, "categories", cat2.id), { order: tempOrder }, { merge: true });
      clearMenuCaches();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `categories/${cat1.id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      setDeletingCategory(null);
      clearMenuCaches();
    } catch (e) {
      try {
        await setDoc(doc(db, "categories", id), { deleted: true }, { merge: true });
        setDeletingCategory(null);
        clearMenuCaches();
      } catch (e2) {
        handleFirestoreError(e, OperationType.WRITE, `categories/${id}`);
      }
    }
  };

  const saveCategory = async () => {
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) return;

    try {
      setCategorySaveError("");
      let id = editingCategory.id;
      if (!id) {
        id = editingCategory.name.toLowerCase()
          .replace(/ğ/g, "g")
          .replace(/ü/g, "u")
          .replace(/ş/g, "s")
          .replace(/ı/g, "i")
          .replace(/ö/g, "o")
          .replace(/ç/g, "c")
          .replace(/[^a-z0-9]/g, "-");
        
        if (!id) {
          id = "cat-" + Date.now();
        }
      }

      const orderValue = editingCategory.order !== undefined ? editingCategory.order : (dbCategories.length * 10);

      await setDoc(doc(db, "categories", id), {
        id,
        name: editingCategory.name.trim(),
        description: editingCategory.description.trim() || "Bamm Garden Lezzetleri",
        image: editingCategory.image || "",
        order: orderValue,
        deleted: false
      }, { merge: true });

      setEditingCategory(null);
      clearMenuCaches();
    } catch (e) {
      console.error("Kategori kaydetme hatası:", e);
      setCategorySaveError(e instanceof Error ? "Hata: " + e.message : "Kategori kaydedilirken bir hata oluştu.");
    }
  };

  const startEdit = (p: MenuItem) => {
    setIsEditing(p.id);
    setEditForm(p);
    if (p.image) {
      const isDataUri = p.image.startsWith("data:");
      setImageSourceTab(isDataUri ? "upload" : "url");
    } else {
      setImageSourceTab("upload");
    }
    setImageUploadError("");

    const sub = p.subcategory || "";
    const categorySubs = Array.from(
      new Set(
        products
          .filter((prod) => prod.category === p.category && prod.subcategory)
          .map((prod) => prod.subcategory as string)
      )
    );
    const isCustom = sub !== "" && !categorySubs.includes(sub);
    setShowCustomSubcategoryInput(isCustom);
  };

  const startNew = () => {
    setIsEditing("new");
    setEditForm({
      name: "",
      price: "",
      category: availableCategories[0] || "Yemekler",
      subcategory: "",
      description: "",
      image: "",
    });
    setImageSourceTab("upload");
    setImageUploadError("");
    setShowCustomSubcategoryInput(false);
  };

  const startNewCategory = () => {
    setEditingCategory({
      id: null,
      name: "",
      description: "",
      order: dbCategories.length * 10,
      image: "",
    });
    setCategoryImageSourceTab("upload");
    setCategoryImageUploadError("");
    setCategorySaveError("");
  };

  const startEditCategory = (cat: any) => {
    setEditingCategory({
      id: cat.id,
      name: cat.name,
      description: cat.description || "",
      order: cat.order,
      image: cat.image || "",
    });
    if (cat.image) {
      const isDataUri = cat.image.startsWith("data:");
      setCategoryImageSourceTab(isDataUri ? "upload" : "url");
    } else {
      setCategoryImageSourceTab("upload");
    }
    setCategoryImageUploadError("");
    setCategorySaveError("");
  };

  const writeNfcTag = async () => {
    if ('NDEFReader' in window) {
      try {
        setNfcStatus("NFC etiketini yaklaştırın...");
        const ndef = new (window as any).NDEFReader();
        await ndef.write({
          records: [{ recordType: "url", data: window.location.origin }]
        });
        setNfcStatus("Başarıyla yazıldı! ✅");
        setTimeout(() => setNfcStatus(null), 3000);
      } catch (error) {
        setNfcStatus("Yazma hatası.");
        setTimeout(() => setNfcStatus(null), 3000);
      }
    } else {
      setNfcStatus("NFC desteklenmiyor.");
      setTimeout(() => setNfcStatus(null), 4000);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0F1115] px-6 text-white text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-[#16191E] p-10 rounded-[40px] border border-white/5 shadow-2xl"
        >
          <div className="w-16 h-16 bg-bamm-yellow/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-bamm-yellow/20">
            <Lock size={28} className="text-bamm-yellow" />
          </div>
          <h1 className="text-2xl font-black uppercase mb-2 text-white">Yönetim</h1>
          <p className="text-sm text-gray-500 mb-8">İşletme sahibi girişi</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              className="px-6 py-4 rounded-2xl bg-black/40 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-bamm-yellow transition-all border border-white/5"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
            <input
              type="password"
              placeholder="Şifre"
              className="px-6 py-4 rounded-2xl bg-black/40 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-bamm-yellow transition-all border border-white/5"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            {loginError && (
              <div className="flex items-center gap-2 text-red-400 text-xs justify-center bg-red-400/10 py-3 rounded-xl border border-red-400/20">
                <AlertCircle size={14} />
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className="bg-bamm-yellow text-black px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-yellow-400 active:scale-95 transition-all mt-4 shadow-xl shadow-bamm-yellow/10"
            >
              Giriş Yap
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategoryFilter === "Tümü" || p.category === selectedCategoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 bg-[#0F1115] text-white flex flex-col md:flex-row h-full overflow-hidden relative">
      {/* Sidebar Navigation - Desktop */}
      <div className="hidden md:flex w-64 bg-[#16191E] border-r border-white/5 flex-col pt-12 pb-8 shrink-0">
        <div className="px-6 mb-12">
          <h1 className="text-xl font-black text-bamm-yellow tracking-tighter uppercase italic">BAMM <span className="text-white">PANEL</span></h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Hızlı Özet" },
            { id: "products", icon: Utensils, label: "Ürünler" },
            { id: "categories", icon: FolderOpen, label: "Kategoriler" },
            { id: "settings", icon: Settings, label: "Sistem" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all group ${
                activeTab === item.id 
                  ? "bg-bamm-yellow text-black font-bold shadow-lg shadow-bamm-yellow/5" 
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-medium"
          >
            <LogOut size={20} />
            <span className="text-sm">Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121418] border-t border-white/5 px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {[
          { id: "dashboard", icon: LayoutDashboard, label: "Özet" },
          { id: "products", icon: Utensils, label: "Ürünler" },
          { id: "categories", icon: FolderOpen, label: "Kategori" },
          { id: "settings", icon: Settings, label: "Ayarlar" },
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1.5 transition-all relative ${
                isActive ? "text-bamm-yellow scale-110" : "text-gray-500 hover:text-white"
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${isActive ? "opacity-100" : "opacity-60"}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="adminTabIndicator"
                  className="absolute -bottom-2 w-1 h-1 bg-bamm-yellow rounded-full"
                />
              )}
            </button>
          );
        })}
        <div className="w-[1px] h-8 bg-white/5 mx-2" />
        <button 
          onClick={handleLogout} 
          className="flex flex-col items-center gap-1.5 text-red-500/80 hover:text-red-500 transition-colors"
        >
          <LogOut size={22} />
          <span className="text-[9px] font-black uppercase tracking-[0.1em] opacity-60">Çıkış</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-0">
        {firestoreError && (
          <div className="mx-4 md:mx-12 mt-4 md:mt-8 bg-amber-500/10 border border-bamm-yellow/30 rounded-3xl p-4 md:p-6 flex items-start gap-3 shadow-[0_4px_20px_rgba(250,204,21,0.05)]">
            <div className="p-2.5 bg-bamm-yellow text-bamm-black rounded-xl shrink-0">
              <WifiOff size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs md:text-sm font-black text-bamm-yellow uppercase tracking-wider mb-1">
                Veritabanı Çevrimdışı / Kota Sınırı
              </h4>
              <p className="text-[11px] md:text-xs text-gray-300 font-medium leading-relaxed">
                {firestoreError}
              </p>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="p-4 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Ürün Yönetimi</h1>
                <p className="text-gray-500 text-xs md:text-sm">Menüdeki tüm içerikleri buradan kontrol edin.</p>
              </div>
              <button
                onClick={startNew}
                className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black uppercase text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all shadow-xl"
              >
                <Plus size={18} /> Yeni Ürün Ekle
              </button>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
              <div className="bg-[#16191E] p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5">
                <p className="text-gray-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Toplam</p>
                <h4 className="text-xl md:text-2xl font-black text-white">{products.length}</h4>
              </div>
              <div className="bg-[#16191E] p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5">
                <p className="text-gray-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Kategori</p>
                <h4 className="text-xl md:text-2xl font-black text-bamm-yellow">{Array.from(new Set(products.map(p => p.category))).length}</h4>
              </div>
              <div className="bg-[#16191E] p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 col-span-2 md:col-span-1">
                <p className="text-gray-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Popüler</p>
                <h4 className="text-xl md:text-2xl font-black text-green-400">{products.filter(p => p.isPopular).length}</h4>
              </div>
            </div>

            <div className="bg-[#16191E] rounded-3xl md:rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
              {/* Toolbar */}
              <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.01]">
                <div className="flex gap-2 p-1 bg-black/40 rounded-2xl overflow-x-auto no-scrollbar w-full md:w-auto">
                  {["Tümü", ...availableCategories.filter(c => products.some(p => p.category === c))].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-xs font-bold whitespace-nowrap transition-all ${
                        selectedCategoryFilter === cat 
                          ? "bg-white text-black shadow-lg scale-105" 
                          : "text-gray-500 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                  <input
                    type="text"
                    placeholder="Ürün Ara..."
                    className="w-full bg-black/40 border-none rounded-xl md:rounded-2xl py-3 pl-10 md:pl-12 pr-4 text-xs md:text-sm text-white focus:ring-1 focus:ring-bamm-yellow transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block p-4 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      <th className="px-6 py-4">Ürün Detayı</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Fiyat</th>
                      <th className="px-6 py-4 text-right">Düzenle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black rounded-xl overflow-hidden shrink-0 border border-white/10 p-0.5">
                              {p.image ? (
                                <img src={p.image} className="w-full h-full object-cover rounded-lg" alt="" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20 font-black text-xs uppercase">{p.name.substring(0, 2)}</div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-white flex items-center gap-2">
                                {p.name}
                                {p.isPopular && <Star size={12} className="text-bamm-yellow fill-bamm-yellow" />}
                              </span>
                              <span className="text-xs text-gray-500 truncate max-w-[200px]">{p.description || "Açıklama yok"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest w-fit">{p.category}</span>
                            {p.subcategory && (
                              <span className="text-[9px] font-medium text-gray-600 uppercase tracking-wider pl-1">{p.subcategory}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 font-black text-bamm-yellow text-sm">
                          {p.price}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(p)} className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"><Edit2 size={14} /></button>
                            <button onClick={() => setIsDeleting(p.id)} className="w-9 h-9 flex items-center justify-center bg-red-400/10 hover:bg-red-400/20 rounded-xl text-red-400 transition-all"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-white/5">
                 {filteredProducts.map((p) => (
                   <div key={p.id} className="p-5 flex items-center gap-4 active:bg-white/5 transition-colors">
                      <div className="w-14 h-14 bg-black rounded-xl overflow-hidden shrink-0 border border-white/10">
                        {p.image ? (
                          <img src={p.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20 font-black text-[10px] uppercase">{p.name.substring(0, 2)}</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h4 className="text-xs font-bold text-white truncate uppercase tracking-tight">{p.name}</h4>
                          {p.isPopular && <Star size={10} className="text-bamm-yellow fill-bamm-yellow" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-bamm-yellow">{p.price}</span>
                          <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none border-l border-white/10 pl-2">
                            {p.subcategory ? `${p.category} / ${p.subcategory}` : p.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => startEdit(p)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-white"><Edit2 size={14} /></button>
                        <button onClick={() => setIsDeleting(p.id)} className="w-10 h-10 flex items-center justify-center bg-red-400/10 rounded-xl text-red-400"><Trash2 size={14} /></button>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="p-4 md:p-12">
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tighter italic leading-none">Hoş Geldiniz,<br className="md:hidden" /> <span className="text-bamm-yellow">BAMM!</span></h1>
            <p className="text-gray-500 text-xs md:text-sm mb-8 md:mb-12">İşletmenizin performansına kısa bir bakış.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-[#16191E] p-6 md:p-10 rounded-3xl md:rounded-[48px] border border-white/5 shadow-xl">
                <h3 className="font-bold text-white mb-4 text-sm md:text-base">Sistem Durumu</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs md:text-sm py-3 border-b border-white/5">
                    <span className="text-gray-400">Veritabanı</span>
                    <span className="text-green-400 font-bold">Aktif</span>
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm py-3 border-b border-white/5">
                    <span className="text-gray-400">Görüntüleme</span>
                    <span className="text-white font-bold">1,240</span>
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm py-3 border-b border-white/5">
                    <span className="text-gray-400">Versiyon</span>
                    <span className="text-gray-600">v2.1.0</span>
                  </div>
                </div>
              </div>
              <div className="bg-bamm-yellow p-6 md:p-10 rounded-3xl md:rounded-[48px] shadow-xl shadow-bamm-yellow/5">
                <h3 className="font-black text-black mb-4 uppercase tracking-wider text-sm md:text-base">Duyuru</h3>
                <p className="text-black/70 text-xs md:text-sm leading-relaxed font-medium">
                  Menüdeki fiyatları güncelledikten sonra NFC etiketlerini kontrol etmeyi unutmayın. 
                  Bir sonraki güncellemede sipariş takip sistemi eklenecektir.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="p-4 md:p-12 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Kategori Yönetimi</h1>
                <p className="text-gray-500 text-xs md:text-sm">Menüdeki üst menü kategorilerini düzenleyin, sıralayın veya yeni ekleyin.</p>
              </div>
              <button
                onClick={startNewCategory}
                className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black uppercase text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all shadow-xl self-start md:self-auto"
              >
                <Plus size={18} /> Yeni Kategori Ekle
              </button>
            </div>

            {dbCategories.length === 0 ? (
              <div className="bg-[#16191E] p-10 rounded-[32px] border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 bg-bamm-yellow/10 rounded-3xl flex items-center justify-center mb-6 border border-bamm-yellow/20 animate-pulse">
                  <FolderOpen size={28} className="text-bamm-yellow" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Henüz Dinamik Kategori Bulunmuyor</h3>
                <p className="text-gray-400 text-xs md:text-sm max-w-md mb-8 leading-relaxed">
                  Veritabanında tanımlı dinamik kategori bulunamadı. Hemen varsayılan kategorileri yükleyerek düzenlemeye başlayabilirsiniz.
                </p>
                <button
                  onClick={seedDefaultCategories}
                  disabled={isSeeding}
                  className="bg-bamm-yellow text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-yellow-400 disabled:opacity-50 active:scale-95 transition-all shadow-xl shadow-bamm-yellow/10"
                >
                  {isSeeding ? "Yükleniyor..." : "Varsayılan Kategorileri Yükle"}
                </button>
              </div>
            ) : (
              <div className="bg-[#16191E] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-5 md:p-6 border-b border-white/5 bg-white/[0.01]">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Üst Menü Kategorileri ({dbCategories.length})</h4>
                </div>
                <div className="divide-y divide-white/5">
                  {dbCategories.map((cat, index) => (
                    <div key={cat.id} className="p-5 flex items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[9px] font-black text-bamm-yellow bg-bamm-yellow/10 px-2.5 py-1 rounded-md tracking-wider">
                            SIRA {index + 1}
                          </span>
                          <h4 className="text-sm font-bold text-white uppercase tracking-tight">{cat.name}</h4>
                        </div>
                        <p className="text-xs text-gray-500 truncate max-w-[280px] md:max-w-md">{cat.description || "Açıklama yok"}</p>
                      </div>

                      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                        {/* Sıralama Okları */}
                        <button
                          onClick={() => moveCategory(index, 'up')}
                          disabled={index === 0}
                          className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white disabled:opacity-20 transition-all border border-white/5"
                          title="Yukarı Taşı"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => moveCategory(index, 'down')}
                          disabled={index === dbCategories.length - 1}
                          className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white disabled:opacity-20 transition-all border border-white/5"
                          title="Aşağı Taşı"
                        >
                          <ArrowDown size={14} />
                        </button>

                        {/* Düzenle & Sil */}
                        <button
                          onClick={() => startEditCategory(cat)}
                          className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all border border-white/5"
                          title="Düzenle"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingCategory({ id: cat.id, name: cat.name });
                          }}
                          className="w-9 h-9 flex items-center justify-center bg-red-400/10 hover:bg-red-400/20 rounded-xl text-red-400 transition-all"
                          title="Sil"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-4 md:p-12 max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Sistem Araçları</h1>
            <p className="text-gray-500 text-xs md:text-sm mb-8 md:mb-12">Dijital menü yönetim ayarları</p>

            <div className="space-y-6">
              <div className="bg-[#16191E] p-6 md:p-8 rounded-3xl md:rounded-[40px] border border-white/5 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400"><Nfc size={24} /></div>
                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base">NFC Yapılandırma</h3>
                    <p className="text-[10px] md:text-xs text-gray-500">Müşteri etiketlerini menüye yönlendir</p>
                  </div>
                </div>
                <button
                  onClick={writeNfcTag}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-600/10"
                >
                  Linki NFC'ye Tanımla
                </button>
                {nfcStatus && (
                  <div className="mt-4 p-3 rounded-xl bg-blue-400/10 border border-blue-400/20 text-blue-300 text-[10px] text-center font-bold">
                    {nfcStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit/Add Side Panel */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setIsEditing(null)} 
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative bg-[#16191E] w-full md:w-[480px] h-full shadow-2xl border-l border-white/5 flex flex-col p-6 md:p-12"
            >
              <div className="flex items-center justify-between mb-8 md:mb-10">
                <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter italic">
                  {isEditing === "new" ? "Yeni Ürün" : "Düzenle"}
                </h2>
                <button onClick={() => setIsEditing(null)} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/10">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 md:space-y-6 pb-20 md:pb-8 pr-1">
                <div>
                  <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block pl-1">Ürün İsmi</label>
                  <input
                    type="text"
                    placeholder="Örn: Bamm Special"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm text-white focus:ring-1 focus:ring-bamm-yellow transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest block font-sans">Ürün Görseli</label>
                    <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
                      <button
                        type="button"
                        onClick={() => setImageSourceTab("upload")}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                          imageSourceTab === "upload"
                            ? "bg-bamm-yellow text-black font-black"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Cihazdan Yükle
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceTab("url")}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                          imageSourceTab === "url"
                            ? "bg-bamm-yellow text-black font-black"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Görsel URL'si
                      </button>
                    </div>
                  </div>

                  {imageSourceTab === "upload" ? (
                    <div className="space-y-3">
                      {editForm.image && editForm.image.startsWith("data:") ? (
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-4 flex items-center gap-4 group">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0">
                            <img src={editForm.image} className="w-full h-full object-cover" alt="Yüklenen Görsel" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs text-green-400 font-bold block mb-1">Görsel Hazır! ✅</span>
                            <span className="text-[10px] text-gray-500 block truncate">Cihazınızdaki görsel optimize edilerek kaydedildi.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditForm(prev => ({ ...prev, image: "" }))}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2.5 rounded-xl transition-all border border-red-500/10 active:scale-95"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-bamm-yellow/30 bg-black/20 hover:bg-black/40 rounded-2xl p-8 cursor-pointer transition-all text-center group">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (!file.type.startsWith("image/")) {
                                setImageUploadError("Lütfen geçerli bir resim seçin.");
                                return;
                              }
                              try {
                                setImageUploadLoading(true);
                                setImageUploadError("");
                                const compressed = await compressImage(file);
                                setEditForm(prev => ({ ...prev, image: compressed }));
                              } catch (err) {
                                console.error(err);
                                setImageUploadError("Resim yüklenirken hata oluştu.");
                              } finally {
                                setImageUploadLoading(false);
                              }
                            }}
                          />
                          {imageUploadLoading ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 border-2 border-bamm-yellow border-t-transparent rounded-full animate-spin" />
                              <span className="text-[11px] font-bold text-gray-400">Görsel Sıkıştırılıyor...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-bamm-yellow/10 flex items-center justify-center text-gray-400 group-hover:text-bamm-yellow transition-all mb-1 border border-white/5 group-hover:border-bamm-yellow/10">
                                <Upload size={20} />
                              </div>
                              <span className="text-xs font-bold text-gray-300">Görsel Seçmek için Tıklayın</span>
                              <span className="text-[10px] text-gray-500 max-w-[200px]">PNG, JPG, WEBP (Maksimum 600px genişliğinde optimize edilir)</span>
                            </div>
                          )}
                        </label>
                      )}

                      {imageUploadError && (
                        <div className="flex items-center gap-2 text-red-400 text-[11px] justify-center bg-red-400/10 p-3 rounded-xl border border-red-400/10">
                          <AlertCircle size={14} />
                          {imageUploadError}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="https://gorsel-linki.com/resim.jpg"
                        value={(editForm.image && !editForm.image.startsWith("data:")) ? editForm.image : ""}
                        onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm text-white focus:ring-1 focus:ring-bamm-yellow transition-all"
                      />
                      {editForm.image && !editForm.image.startsWith("data:") && (
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl border border-white/10 overflow-hidden bg-black shrink-0">
                          <img src={editForm.image} className="w-full h-full object-cover" alt="Önizleme" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block pl-1">Fiyat</label>
                    <input
                      type="text"
                      placeholder="150₺"
                      value={editForm.price || ""}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm text-white focus:ring-1 focus:ring-bamm-yellow"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block pl-1">Kategori</label>
                    <div className="relative">
                      <select
                        value={editForm.category || ""}
                        onChange={(e) => {
                          setEditForm({ ...editForm, category: e.target.value, subcategory: "" });
                          setShowCustomSubcategoryInput(false);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm text-white appearance-none cursor-pointer focus:ring-1 focus:ring-bamm-yellow"
                      >
                        {availableCategories.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block pl-1">Alt Kategori (Opsiyonel)</label>
                  {currentCategorySubcategories.length > 0 ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <select
                          value={showCustomSubcategoryInput ? "__custom__" : (editForm.subcategory || "")}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "__custom__") {
                              setShowCustomSubcategoryInput(true);
                              setEditForm({ ...editForm, subcategory: "" });
                            } else {
                              setShowCustomSubcategoryInput(false);
                              setEditForm({ ...editForm, subcategory: val });
                            }
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm text-white appearance-none cursor-pointer focus:ring-1 focus:ring-bamm-yellow"
                        >
                          <option value="" className="text-black">Yok (Alt Kategori Yok)</option>
                          {currentCategorySubcategories.map(sub => (
                            <option key={sub} value={sub} className="text-black">{sub}</option>
                          ))}
                          <option value="__custom__" className="text-black">+ Yeni / Özel Alt Kategori Ekle...</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                      </div>

                      {showCustomSubcategoryInput && (
                        <div className="pt-1">
                          <div className="flex justify-between items-center mb-1.5 pl-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Yeni Alt Kategori Adı</span>
                            <button
                              type="button"
                              onClick={() => {
                                setShowCustomSubcategoryInput(false);
                                setEditForm({ ...editForm, subcategory: "" });
                              }}
                              className="text-[9px] font-black text-bamm-yellow hover:underline uppercase"
                            >
                              Seçime Geri Dön
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Örn: Burgerler, Sıcak Kokteyller"
                            value={editForm.subcategory || ""}
                            onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm text-white focus:ring-1 focus:ring-bamm-yellow transition-all"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder="Örn: Burgerler, Sıcak Kokteyller"
                        value={editForm.subcategory || ""}
                        onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm text-white focus:ring-1 focus:ring-bamm-yellow transition-all"
                      />
                      <p className="text-[10px] text-gray-500 mt-1 pl-1">Bu kategoride daha önce oluşturulmuş alt kategori yok. Yeni bir tane yazabilirsiniz.</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block pl-1">Açıklama</label>
                  <textarea
                    value={editForm.description || ""}
                    rows={3}
                    placeholder="Ürün içeriğini buraya yazın..."
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm text-white focus:ring-1 focus:ring-bamm-yellow resize-none"
                  />
                </div>

                <div className="p-5 md:p-8 bg-white/[0.02] rounded-2xl md:rounded-[32px] border border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border transition-all ${
                      editForm.isPopular ? "bg-bamm-yellow/20 border-bamm-yellow/40 text-bamm-yellow" : "bg-white/5 border-white/5 text-gray-600"
                    }`}>
                      <Star size={18} className={editForm.isPopular ? "fill-bamm-yellow" : ""} />
                    </div>
                    <div>
                      <span className="text-sm md:text-base font-bold block">Popüler?</span>
                      <span className="text-[10px] md:text-xs text-gray-500">Ana sayfada öne çıkar.</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEditForm({ ...editForm, isPopular: !editForm.isPopular })}
                    className={`w-12 h-7 md:w-14 md:h-8 rounded-full relative transition-all ${
                      editForm.isPopular ? "bg-bamm-yellow" : "bg-white/10"
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white transition-all shadow-md ${
                      editForm.isPopular ? "left-6 md:left-7" : "left-1"
                    }`} />
                  </button>
                </div>
              </div>

              <div className="fixed md:relative bottom-4 left-4 right-4 md:bottom-0 md:left-0 md:right-0 flex gap-4 mt-auto">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-bamm-yellow text-black py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[11px] md:text-[13px] tracking-widest active:scale-95 transition-all shadow-xl shadow-bamm-yellow/10"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Edit/Add Modal */}
      <AnimatePresence>
        {editingCategory && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setEditingCategory(null)} 
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative bg-[#16191E] w-full md:w-[480px] h-full shadow-2xl border-l border-white/5 flex flex-col p-6 md:p-12"
            >
              <div className="flex items-center justify-between mb-8 md:mb-10">
                <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter italic">
                  {editingCategory.id ? "Kategori Düzenle" : "Yeni Kategori"}
                </h2>
                <button onClick={() => setEditingCategory(null)} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/10">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 md:space-y-6 pb-20 md:pb-8 pr-1">
                <div>
                  <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block pl-1">Kategori Adı</label>
                  <input
                    type="text"
                    placeholder="Örn: Ev Yapımı Limonatalar"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm text-white focus:ring-1 focus:ring-bamm-yellow transition-all"
                  />
                </div>

                <div>
                  <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block pl-1">Açıklama / Alt Başlık</label>
                  <input
                    type="text"
                    placeholder="Örn: Taze ve ferahlatıcı seçenekler"
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm text-white focus:ring-1 focus:ring-bamm-yellow transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest block font-sans">Kategori Görseli (Opsiyonel)</label>
                    <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
                      <button
                        type="button"
                        onClick={() => setCategoryImageSourceTab("upload")}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                          categoryImageSourceTab === "upload"
                            ? "bg-bamm-yellow text-black font-black"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Cihazdan Yükle
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryImageSourceTab("url")}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                          categoryImageSourceTab === "url"
                            ? "bg-bamm-yellow text-black font-black"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Görsel URL'si
                      </button>
                    </div>
                  </div>

                  {categoryImageSourceTab === "upload" ? (
                    <div className="space-y-3">
                      {editingCategory.image && editingCategory.image.startsWith("data:") ? (
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-4 flex items-center gap-4 group">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0">
                            <img src={editingCategory.image} className="w-full h-full object-cover" alt="Yüklenen Görsel" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs text-green-400 font-bold block mb-1">Görsel Hazır! ✅</span>
                            <span className="text-[10px] text-gray-500 block truncate">Cihazınızdaki görsel optimize edilerek kaydedildi.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingCategory(prev => prev ? ({ ...prev, image: "" }) : null)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2.5 rounded-xl transition-all border border-red-500/10 active:scale-95"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-bamm-yellow/30 bg-black/20 hover:bg-black/40 rounded-2xl p-8 cursor-pointer transition-all text-center group">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (!file.type.startsWith("image/")) {
                                setCategoryImageUploadError("Lütfen geçerli bir resim seçin.");
                                return;
                              }
                              try {
                                setCategoryImageUploadLoading(true);
                                setCategoryImageUploadError("");
                                const compressed = await compressImage(file);
                                setEditingCategory(prev => prev ? ({ ...prev, image: compressed }) : null);
                              } catch (err) {
                                console.error(err);
                                setCategoryImageUploadError("Resim yüklenirken hata oluştu.");
                              } finally {
                                setCategoryImageUploadLoading(false);
                              }
                            }}
                          />
                          {categoryImageUploadLoading ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 border-2 border-bamm-yellow border-t-transparent rounded-full animate-spin" />
                              <span className="text-[11px] font-bold text-gray-400">Görsel Sıkıştırılıyor...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-bamm-yellow/10 flex items-center justify-center text-gray-400 group-hover:text-bamm-yellow transition-all mb-1 border border-white/5 group-hover:border-bamm-yellow/10">
                                <Upload size={20} />
                              </div>
                              <span className="text-xs font-bold text-gray-300">Görsel Seçmek için Tıklayın</span>
                              <span className="text-[10px] text-gray-500 max-w-[200px]">PNG, JPG, WEBP (Maksimum 600px genişliğinde optimize edilir)</span>
                            </div>
                          )}
                        </label>
                      )}

                      {categoryImageUploadError && (
                        <div className="flex items-center gap-2 text-red-400 text-[11px] justify-center bg-red-400/10 p-3 rounded-xl border border-red-400/10">
                          <AlertCircle size={14} />
                          {categoryImageUploadError}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="https://gorsel-linki.com/resim.jpg"
                        value={(editingCategory.image && !editingCategory.image.startsWith("data:")) ? editingCategory.image : ""}
                        onChange={(e) => setEditingCategory(prev => prev ? ({ ...prev, image: e.target.value }) : null)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm text-white focus:ring-1 focus:ring-bamm-yellow transition-all"
                      />
                      {editingCategory.image && !editingCategory.image.startsWith("data:") && (
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl border border-white/10 overflow-hidden bg-black shrink-0">
                          <img src={editingCategory.image} className="w-full h-full object-cover" alt="Önizleme" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {categorySaveError && (
                <div className="mt-4 flex items-center gap-2 text-red-400 text-[11px] justify-center bg-red-400/10 p-3 rounded-xl border border-red-400/10">
                  <AlertCircle size={14} />
                  {categorySaveError}
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-white/5 flex gap-4 bg-[#16191E] relative z-10">
                <button
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold uppercase text-[10px] md:text-xs transition-all border border-white/5"
                >
                  İptal
                </button>
                <button
                  onClick={saveCategory}
                  className="flex-1 bg-bamm-yellow hover:bg-yellow-400 text-black py-4 rounded-xl font-black uppercase text-[10px] md:text-xs transition-all shadow-xl shadow-bamm-yellow/10"
                >
                  Kaydet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsDeleting(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#1A1D23] p-10 rounded-[48px] border border-white/10 shadow-2xl w-full max-w-sm text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-red-500"><Trash2 size={32} /></div>
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic leading-none">Silmek<br />İstediniz Mi?</h2>
              <p className="text-sm text-gray-500 mb-10">Bu işlemi geri alamazsınız.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => confirmDelete(isDeleting)} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all">Evet, Sil</button>
                <button onClick={() => setIsDeleting(null)} className="w-full bg-white/5 text-gray-400 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:text-white transition-colors">Vazgeç</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Delete Confirmation */}
      <AnimatePresence>
        {deletingCategory && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setDeletingCategory(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#1A1D23] p-10 rounded-[48px] border border-white/10 shadow-2xl w-full max-w-sm text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-red-500"><Trash2 size={32} /></div>
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic leading-none">Kategoriyi<br />Sil?</h2>
              <p className="text-sm text-gray-400 mb-1 leading-relaxed">"${deletingCategory.name}" kategorisini silmek istediğinizden emin misiniz?</p>
              <p className="text-[10px] text-gray-500 mb-10 leading-relaxed">Bu kategori altındaki ürünler silinmez fakat kategorileri güncellenene kadar ana menüde listelenmeyebilirler.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => deleteCategory(deletingCategory.id)} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all">Evet, Sil</button>
                <button onClick={() => setDeletingCategory(null)} className="w-full bg-white/5 text-gray-400 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:text-white transition-colors">Vazgeç</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
