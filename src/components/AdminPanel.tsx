import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { CATEGORIES, MENU_DATA, MenuItem } from "../data";
import { LogOut, Plus, Edit2, Trash2 } from "lucide-react";

export function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<MenuItem[]>(MENU_DATA);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("Tümü");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
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
    });
    return unsub;
  }, [user]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      alert("Giriş başarısız oldu.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
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
    } catch (e) {
      console.error(e);
      alert("Kaydedilemedi!");
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      await setDoc(doc(db, "products", id), { deleted: true }, { merge: true });
      setIsDeleting(null);
    } catch (e) {
      console.error(e);
      // alert yerine custom bir hata eklenebilir ama şimdilik konsola yazdıralım.
    }
  };

  const handleDelete = (id: string) => {
    setIsDeleting(id);
  };

  const startEdit = (p: MenuItem) => {
    setIsEditing(p.id);
    setEditForm(p);
  };

  const startNew = () => {
    setIsEditing("new");
    setEditForm({
      name: "",
      price: "",
      category: CATEGORIES[0],
      description: "",
      image: "",
    });
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bamm-black px-6 text-white text-center">
        <h1 className="text-2xl font-black italic uppercase mb-2 text-bamm-yellow">
          Yönetim Paneli
        </h1>
        <p className="text-sm text-gray-400 mb-8 max-w-xs">
          Bu alana sadece yetkili kişiler giriş yapabilir.
        </p>
        <button
          onClick={handleLogin}
          className="bg-white text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm active:scale-95 transition-transform"
        >
          Google ile Giriş Yap
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#13151A] text-white overflow-hidden flex flex-col relative w-full h-full xl:max-w-4xl mx-auto shadow-2xl">
      <div className="flex-shrink-0 px-6 pt-8 pb-6 bg-[#13151A]/80 backdrop-blur-xl z-10 sticky top-0 border-b border-white/5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-widest uppercase text-bamm-yellow drop-shadow-md">
              Panel
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Giriş Yapıldı: <span className="text-white">{user.email}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full flex items-center justify-center transition-all duration-300"
          >
            <LogOut size={16} />
          </button>
        </div>

        <button
          onClick={startNew}
          className="w-full bg-bamm-yellow hover:bg-yellow-400 text-bamm-black font-black uppercase text-sm py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,204,0,0.2)] transition-all duration-300 active:scale-[0.98]"
        >
          <Plus size={20} /> Yeni Ürün Ekle
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 pt-4">
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          {["Tümü", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                selectedCategoryFilter === cat
                  ? "bg-bamm-yellow text-bamm-black shadow-[0_4px_10px_rgba(255,215,0,0.2)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(selectedCategoryFilter === "Tümü" ? products : products.filter(p => p.category === selectedCategoryFilter)).map((p) => (
            <div
              key={p.id}
              className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-4 rounded-3xl flex items-center gap-4 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-bamm-yellow/0 via-bamm-yellow/0 to-bamm-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="w-16 h-16 bg-black/50 rounded-2xl overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold uppercase text-white/20">{p.name.substring(0, 2)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-base text-white truncate mb-1">{p.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="bg-white/10 px-2 py-0.5 rounded-full text-white/80 whitespace-nowrap overflow-hidden text-ellipsis">{p.category}</span>
                  <span className="text-bamm-yellow font-medium whitespace-nowrap shrink-0">{p.price}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 relative z-10 shrink-0">
                <button
                  onClick={() => startEdit(p)}
                  className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="w-8 h-8 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(null)} />
          <div className="relative bg-[#1A1C21] rounded-t-[40px] p-6 pb-12 w-full max-w-2xl mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.5)] border-t border-white/10 flex flex-col max-h-[90vh]">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 shrink-0" />
            
            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-wide shrink-0">
              {isEditing === "new" ? "Yeni Ürün" : "Ürünü Düzenle"}
            </h2>
            
            <div className="space-y-5 overflow-y-auto no-scrollbar pr-2 pb-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block pl-1">Ürün Adı</label>
                <input
                  type="text"
                  placeholder="Ürün Adı"
                  value={editForm.name || ""}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-bamm-yellow transition-colors placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block pl-1">Fiyat</label>
                <input
                  type="text"
                  placeholder="örn: 420 TL"
                  value={editForm.price || ""}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-bamm-yellow transition-colors placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block pl-1">Kategori</label>
                <div className="relative">
                  <input
                    type="text"
                    list="categories-list"
                    placeholder="Seç veya yaz"
                    value={editForm.category || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      let defaultSubcategory;
                      if (val === "Kokteyller") defaultSubcategory = "İmza Kokteylleri";
                      else if (val === "Biralar") defaultSubcategory = "Fıçı Biralar";
                      else if (val === "Kampanyalar") defaultSubcategory = "1+1";
                      else if (val === "Yemekler") defaultSubcategory = "Beyaz Etler";
                      else if (val === "Kahvaltı") defaultSubcategory = "Breakfast";

                      setEditForm({
                        ...editForm,
                        category: val,
                        subcategory: defaultSubcategory
                      });
                    }}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-bamm-yellow transition-colors placeholder:text-gray-600"
                  />
                  <datalist id="categories-list">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {editForm.category === "Kokteyller" && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block pl-1">Alt Kategori</label>
                  <select
                    value={editForm.subcategory || "İmza Kokteylleri"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subcategory: e.target.value })
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-bamm-yellow transition-colors appearance-none"
                  >
                    <option value="İmza Kokteylleri" className="text-black">İmza Kokteylleri</option>
                    <option value="Dünya Klasikleri" className="text-black">Dünya Klasikleri</option>
                  </select>
                </div>
              )}

              {editForm.category === "Biralar" && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block pl-1">Alt Kategori</label>
                  <select
                    value={editForm.subcategory || "Fıçı Biralar"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subcategory: e.target.value })
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-bamm-yellow transition-colors appearance-none"
                  >
                    <option value="Fıçı Biralar" className="text-black">Fıçı Biralar</option>
                    <option value="Şişe Biralar" className="text-black">Şişe Biralar</option>
                    <option value="Kova Biralar" className="text-black">Kova Biralar</option>
                    <option value="İthal Biralar" className="text-black">İthal Biralar</option>
                  </select>
                </div>
              )}

              {editForm.category === "Kampanyalar" && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block pl-1">Alt Kategori</label>
                  <select
                    value={editForm.subcategory || "1+1"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subcategory: e.target.value })
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-bamm-yellow transition-colors appearance-none"
                  >
                    <option value="1+1" className="text-black">1+1</option>
                    <option value="Şarap" className="text-black">Şarap</option>
                    <option value="Shoot" className="text-black">Shoot</option>
                    <option value="Fıçı Kampanya" className="text-black">Fıçı Kampanya</option>
                  </select>
                </div>
              )}

              {editForm.category === "Yemekler" && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block pl-1">Alt Kategori</label>
                  <select
                    value={editForm.subcategory || "Beyaz Etler"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subcategory: e.target.value })
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-bamm-yellow transition-colors appearance-none"
                  >
                    <option value="Beyaz Etler" className="text-black">Beyaz Etler</option>
                    <option value="Kırmızı Etler" className="text-black">Kırmızı Etler</option>
                    <option value="Burgerler" className="text-black">Burgerler</option>
                    <option value="Wrapler" className="text-black">Wrapler</option>
                    <option value="Makarnalar" className="text-black">Makarnalar</option>
                    <option value="Pizzalar" className="text-black">Pizzalar</option>
                  </select>
                </div>
              )}

              {editForm.category === "Kahvaltı" && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block pl-1">Alt Kategori</label>
                  <select
                    value={editForm.subcategory || "Breakfast"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subcategory: e.target.value })
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-bamm-yellow transition-colors appearance-none"
                  >
                    <option value="Breakfast" className="text-black">Breakfast</option>
                    <option value="Omletler" className="text-black">Omletler</option>
                    <option value="Sahanda" className="text-black">Sahanda</option>
                    <option value="Tostlar" className="text-black">Tostlar</option>
                    <option value="Kahvaltı Yanı" className="text-black">Kahvaltı Yanı</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block pl-1">Açıklama</label>
                <textarea
                  placeholder="İçindekiler vs."
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-bamm-yellow transition-colors h-28 placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block pl-1">Görsel URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editForm.image || ""}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-bamm-yellow transition-colors placeholder:text-gray-600"
                />
              </div>

              <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                <label className="flex items-center gap-3 text-sm text-white font-medium cursor-pointer">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={editForm.isPopular || false}
                      onChange={(e) => setEditForm({ ...editForm, isPopular: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bamm-yellow"></div>
                  </div>
                  Popüler (Yıldızlı Ürün)
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-6 shrink-0 mt-auto border-t border-white/5">
              <button
                onClick={() => setIsEditing(null)}
                className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold uppercase tracking-wider text-sm transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-bamm-yellow hover:bg-yellow-400 text-bamm-black py-4 rounded-2xl font-black uppercase tracking-wider text-sm shadow-xl transition-all active:scale-95"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleting && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-center items-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleting(null)} />
          <div className="relative bg-[#1A1C21] rounded-[32px] p-8 w-full max-w-sm mx-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
              <Trash2 size={24} />
            </div>
            <h2 className="text-xl font-black text-white mb-2 uppercase tracking-wide">
              Emin Misiniz?
            </h2>
            <p className="text-sm text-gray-400 mb-8">
              Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setIsDeleting(null)}
                className="flex-1 bg-white/5 hover:bg-white/10 py-3.5 rounded-2xl font-bold text-sm transition-colors text-white"
              >
                İptal
              </button>
              <button
                onClick={() => confirmDelete(isDeleting)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-red-500/20 transition-all active:scale-95"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
