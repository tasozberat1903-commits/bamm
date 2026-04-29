export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  isPopular?: boolean;
  allergens?: string[];
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  image?: string;
  category?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image?: string;
}

export const CATEGORIES = [
  "Alkoller", "Kokteyller", "Biralar", "Ana Yemekler", "Popüler", "Kahvaltı", "Atıştırmalıklar", "Tost & Sandviç", "Dürümler & Bowl", "Burgerler", "Pizzalar", "Makarnalar", "Salatalar", "Tatlılar", "Sıcak İçecekler", "Soğuk İçecekler"
];

export const MENU_DATA: MenuItem[] = [
  // --- POPÜLER ---
  {
    id: "p1",
    name: "BAMM Burger",
    description: "160gr dana köfte, karamelize soğan, cheddar peyniri, turşu, yeşillik ve patates kızartması ile.",
    price: "420 TL",
    category: "Burgerler",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
  },
  {
    id: "p2",
    name: "PİNK TO BAMM",
    description: "BAMM'ın imza pembe kokteyli; votka, taze meyve özleri ve gizli dokunuşlar.",
    price: "460 TL",
    category: "Kokteyller",
    isPopular: true,
  },
  {
    id: "p3",
    name: "BAMM Combo Tabağı",
    description: "Sosis, mozzarella sticks, soğan halkası, çıtır tavuk, sigara böreği ve patates kızartması.",
    price: "390 TL",
    category: "Atıştırmalıklar",
    isPopular: true,
  },
  {
    id: "p4",
    name: "Turkish Breakfast (Serpme)",
    description: "Zengin peynir çeşitleri, zeytinler, ev yapımı reçeller, sucuklu yumurta, sınırsız çay ile (Kişi başı).",
    price: "480 TL",
    category: "Kahvaltı",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
  },

  // --- KAHVALTI ---
  {
    id: "kv1",
    name: "American Breakfast",
    description: "Dana sosis, bacon, 2 adet göz yumurta, hash brown patates, kızarmış ekmek.",
    price: "390 TL",
    category: "Kahvaltı",
    image: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "kv2",
    name: "Croissant Classico",
    description: "Taze kruvasan içerisinde çırpılmış yumurta, kaşar peyniri ve salam.",
    price: "280 TL",
    category: "Kahvaltı",
  },
  {
    id: "kv3",
    name: "Morning Burger",
    description: "Brioche ekmeği, dana köfte, göz yumurta, cheddar ve hollandaise sos.",
    price: "350 TL",
    category: "Kahvaltı",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "kv4",
    name: "Kahvaltı Tabağı",
    description: "Klasik Türk kahvaltısı öğeleri; peynir, zeytin, domates, salatalık, yumurta, bal-kaymak.",
    price: "320 TL",
    category: "Kahvaltı",
  },

  // --- ATIŞTIRMALIKLAR ---
  {
    id: "a1",
    name: "Çıtır Tavuk Parçaları",
    description: "Özel panelenmiş çıtır tavuklar, ballı hardal sos ile.",
    price: "240 TL",
    category: "Atıştırmalıklar",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "a2",
    name: "BAMM Patates",
    description: "Özel baharat karışımlı elma dilim patates.",
    price: "160 TL",
    category: "Atıştırmalıklar",
  },
  {
    id: "a3",
    name: "Mozzarella Sticks",
    description: "6 adet panelenmiş mozzarella peyniri.",
    price: "220 TL",
    category: "Atıştırmalıklar",
    image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&q=80&w=800",
  },

  // --- TOST & SANDVİÇ ---
  {
    id: "ts1",
    name: "Bazlama Tost",
    description: "Özel bazlama ekmeğinde bol kaşar, sucuk ve domates salçası.",
    price: "240 TL",
    category: "Tost & Sandviç",
  },
  {
    id: "ts2",
    name: "Karışık Tost",
    description: "Tost ekmeğinde kaşar peyniri ve dana sucuk.",
    price: "210 TL",
    category: "Tost & Sandviç",
    image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ts3",
    name: "Kaşarlı Tost",
    description: "Tost ekmeğinde erimiş kaşar peyniri.",
    price: "180 TL",
    category: "Tost & Sandviç",
    image: "https://images.unsplash.com/photo-1475090169767-40ed8d18f67d?auto=format&fit=crop&q=80&w=800",
  },

  // --- DÜRÜMLER & BOWL ---
  {
    id: "db1",
    name: "Tavuklu Dürüm",
    description: "Lavaş içerisinde ızgara tavuk parçaları, yeşillik ve özel sos; yanında patates kızartması ile.",
    price: "280 TL",
    category: "Dürümler & Bowl",
  },
  {
    id: "db2",
    name: "Köfteli Dürüm",
    description: "Lavaş içerisinde kasap köfte, domates, soğan ve yeşillik; yanında patates kızartması ile.",
    price: "320 TL",
    category: "Dürümler & Bowl",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "db3",
    name: "Power Bowl",
    description: "Izgara tavuk, kinoa, avokado, mısır, çeri domates ve yeşillik karışımı.",
    price: "360 TL",
    category: "Dürümler & Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
  },

  // --- BURGERLER ---
  {
    id: "b1",
    name: "Cheeseburger",
    description: "Dana köfte, çift cheddar, turşu, yeşillik, domates.",
    price: "410 TL",
    category: "Burgerler",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "b2",
    name: "Chicken Burger",
    description: "Panelenmiş tavuk göğsü, özel mayonezli sos, yeşillik.",
    price: "360 TL",
    category: "Burgerler",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=800",
  },

  // --- PİZZALAR ---
  {
    id: "z1",
    name: "BAMM Karışık Pizza",
    description: "Sucuk, sosis, mantar, mısır, zeytin, biber, mozzarella.",
    price: "410 TL",
    category: "Pizzalar",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "z2",
    name: "Pizza Margherita",
    description: "Özel pizza sosu, taze mozzarella, fesleğen.",
    price: "330 TL",
    category: "Pizzalar",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800",
  },

  // --- MAKARNALAR ---
  {
    id: "m1",
    name: "Penne Arabiatta",
    description: "Acılı domates sosu, siyah zeytin, parmesan.",
    price: "310 TL",
    category: "Makarnalar",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "m2",
    name: "Spaghetti Bolognese",
    description: "Geleneksel kıymalı sos ve parmesan peyniri ile.",
    price: "350 TL",
    category: "Makarnalar",
    image: "https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&q=80&w=800",
  },

  // --- SALATALAR ---
  {
    id: "s1",
    name: "Hellim Salata",
    description: "Izgara hellim peyniri, mevsim yeşillikleri, çeri domates, özel sos.",
    price: "330 TL",
    category: "Salatalar",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "s2",
    name: "Tavuklu Sezar Salata",
    description: "Izgara tavuk, marul, kruton, parmesan, Sezar sos.",
    price: "350 TL",
    category: "Salatalar",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=800",
  },

  // --- ANA YEMEKLER ---
  {
    id: "y1",
    name: "Tavuk Schnitzel",
    description: "Panelenmiş tavuk göğsü, patates salatası ve yeşillik ile.",
    price: "380 TL",
    category: "Ana Yemekler",
  },
  {
    id: "y2",
    name: "Izgara Köfte",
    description: "Özel kasap köfte, ızgara sebze, pilav ve patates kızartması ile.",
    price: "440 TL",
    category: "Ana Yemekler",
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "y3",
    name: "Beğendili Kebap",
    description: "Közlenmiş patlıcan beğendi üzerinde sote dana eti parçaları.",
    price: "560 TL",
    category: "Ana Yemekler",
  },
  {
    id: "y4",
    name: "Mantar Soslu Tavuk",
    description: "Izgara tavuk göğsü, kremsi mantar sos, pilav ve haşlanmış sebze ile.",
    price: "390 TL",
    category: "Ana Yemekler",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "y5",
    name: "Cafe de Paris Steak",
    description: "Özel Cafe de Paris soslu dana bonfile dilimleri, patates kızartması ile.",
    price: "640 TL",
    category: "Ana Yemekler",
  },

  // --- TATLILAR ---
  {
    id: "t1",
    name: "San Sebastian Cheesecake",
    description: "Çikolata sos eşliğinde akışkan İspanyol cheesekake.",
    price: "260 TL",
    category: "Tatlılar",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "t2",
    name: "Sufle",
    description: "Sıcak Belçika çikolatası ve vanilyalı dondurma ile.",
    price: "240 TL",
    category: "Tatlılar",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800",
  },

  // --- KOKTEYLLER ---
  {
    id: "k1",
    name: "Kuzu Kulağı",
    description: "Taze kuzu kulağı otu aromalı, ekşi-tatlı votka bazlı ferahlatıcı karışım.",
    price: "440 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
  },
  {
    id: "k2",
    name: "Rönesans",
    description: "Cin bazlı, taze baharatlar ve kırmızı meyvelerle hazırlanan sanatsal bir lezzet.",
    price: "450 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1587223075055-82e9a937ddff?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k3",
    name: "Cuba Libre",
    description: "Rom, kola ve taze lime dilimleri.",
    price: "380 TL",
    category: "Kokteyller",
  },
  {
    id: "k4",
    name: "Whiskey Sour",
    description: "Bourbon whiskey, taze limon suyu, şeker şurubu ve yumurta akı.",
    price: "420 TL",
    category: "Kokteyller",
  },
  {
    id: "k5",
    name: "Margarita",
    description: "Tekila, portakal likörü ve taze lime suyu.",
    price: "410 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k6",
    name: "Sex On The Beach",
    description: "Votka, şeftali likörü, portakal suyu ve vişne suyu.",
    price: "390 TL",
    category: "Kokteyller",
  },
  {
    id: "k7",
    name: "Mojito",
    description: "Rom, taze nane yaprakları, lime, esmer şeker ve soda.",
    price: "400 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k8",
    name: "Long Island Iced Tea",
    description: "Votka, cin, tekila, rom, cointreau, limon suyu ve kola.",
    price: "480 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k9",
    name: "Cosmopolitan",
    description: "Votka, cointreau, yaban mersini suyu ve lime suyu.",
    price: "410 TL",
    category: "Kokteyller",
  },
  {
    id: "k10",
    name: "Gin Tonic",
    description: "Klasik cin, tonik ve ardıç tohumları.",
    price: "380 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k11",
    name: "Goshra",
    description: "Egzotik meyveler ve baharatlı rom ile hazırlanan imza kokteyl.",
    price: "460 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k12",
    name: "Espresso Martini",
    description: "Votka, taze espresso ve kahve likörü.",
    price: "420 TL",
    category: "Kokteyller",
  },
  {
    id: "k13",
    name: "Baileys Brule",
    description: "Baileys, karamel ve kremsi dokulu tatlı bir bitiş.",
    price: "410 TL",
    category: "Kokteyller",
  },
  {
    id: "k14",
    name: "Star of Nights",
    description: "Çarkıfelek meyvesi ve altın efektli parlayan karışım.",
    price: "470 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k15",
    name: "Bamm Love",
    description: "Çilek, nane ve sakızlı aromalarla tatlı bir aşk hikayesi.",
    price: "450 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k16",
    name: "Mojito Çilek",
    description: "Taze çileklerle hazırlanan özel Mojito.",
    price: "420 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k17",
    name: "Marshmallows",
    description: "Hafif, tatlı ve marshmallow aromalı yumuşak içimli kokteyl.",
    price: "430 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k18",
    name: "Lynchburg Lemonade",
    description: "Jack Daniel's, Cointreau, taze limon suyu ve Sprite.",
    price: "440 TL",
    category: "Kokteyller",
  },
  {
    id: "k19",
    name: "Aperol Spritz",
    description: "Aperol, Prosecco ve soda; ferahlatıcı İtalyan klasiği.",
    price: "420 TL",
    category: "Kokteyller",
  },
  {
    id: "k20",
    name: "Negroni",
    description: "Cin, Campari ve kırmızı vermutun mükemmel dengesi.",
    price: "430 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1588767768106-1b20e51d9d68?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k21",
    name: "Old Fashioned",
    description: "Bourbon whiskey, şeker ve Angostura bitters.",
    price: "440 TL",
    category: "Kokteyller",
  },
  {
    id: "k22",
    name: "Blue Lagoon",
    description: "Votka, Blue Curacao ve limonata ile turkuaz ferahlık.",
    price: "390 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1587223075055-82e9a937ddff?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k23",
    name: "Tequila Sunrise",
    description: "Tekila, portakal suyu ve grenadine ile renkli bir geçiş.",
    price: "410 TL",
    category: "Kokteyller",
  },
  {
    id: "k24",
    name: "Martini Dry",
    description: "Cin ve dry vermutun klasik buluşması, yeşil zeytin eşliğinde.",
    price: "390 TL",
    category: "Kokteyller",
  },
  {
    id: "k25",
    name: "Moscow Mule",
    description: "Votka, taze zencefil özü, lime ve soda.",
    price: "430 TL",
    category: "Kokteyller",
  },
  {
    id: "k26",
    name: "Pina Colada",
    description: "Rom, hindistan cevizi sütü ve taze ananas suyu.",
    price: "420 TL",
    category: "Kokteyller",
  },
  {
    id: "k27",
    name: "Amaretto Sour",
    description: "Amaretto likörü, taze limon suyu ve şeker şurubu.",
    price: "420 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k28",
    name: "White Russian",
    description: "Votka, kahve likörü ve taze krema.",
    price: "410 TL",
    category: "Kokteyller",
  },
  {
    id: "k29",
    name: "Black Russian",
    description: "Votka ve kahve likörünün sert uyumu.",
    price: "390 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1588767768106-1b20e51d9d68?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k30",
    name: "Daiquiri",
    description: "Rom, taze lime suyu ve şeker şurubu.",
    price: "380 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k31",
    name: "Strawberry Daiquiri",
    description: "Taze çileklerle hazırlanan frozen Daiquiri.",
    price: "410 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k32",
    name: "Bramble",
    description: "Cin, taze limon suyu ve böğürtlen likörü.",
    price: "430 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k33",
    name: "Manhattan",
    description: "Bourbon whiskey, kırmızı vermut ve Angostura bitters.",
    price: "460 TL",
    category: "Kokteyller",
  },
  {
    id: "k34",
    name: "Caipirinha",
    description: "Cachaca, taze lime dilimleri ve esmer şeker.",
    price: "400 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k35",
    name: "Bloody Mary",
    description: "Votka, domates suyu ve acılı özel baharat karışımı.",
    price: "420 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1528699633788-424224dc89b5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k36",
    name: "Passion Fruit Mojito",
    description: "Çarkıfelek meyvesi ile egzotik Mojito yorumu.",
    price: "440 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k37",
    name: "Frozen Margarita",
    description: "Buz ile çekilmiş ferahlatıcı klasik Margarita.",
    price: "430 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k38",
    name: "Green Apple Martini",
    description: "Votka, yeşil elma likörü ve taze limon suyu.",
    price: "410 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "k39",
    name: "B52 Shot",
    description: "Kahve likörü, Baileys ve Grand Marnier (Katmanlı shot).",
    price: "280 TL",
    category: "Kokteyller",
    image: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?auto=format&fit=crop&q=80&w=800",
  },

  // --- BİRALAR ---
  {
    id: "br1",
    name: "Efes Pilsen Fıçı (50cl)",
    description: "Taze ve soğuk fıçı bira.",
    price: "190 TL",
    category: "Biralar",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "br2",
    name: "Bomonti Filtresiz (50cl)",
    description: "Filtresiz lager bira.",
    price: "210 TL",
    category: "Biralar",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "br3",
    name: "Weihenstephaner Vitus (50cl)",
    description: "Özel Alman buğday birası.",
    price: "280 TL",
    category: "Biralar",
  },

  // --- SICAK İÇECEKLER ---
  {
    id: "h1",
    name: "Türk Kahvesi",
    description: "Geleneksel Türk kahvesi, lokum eşliğinde.",
    price: "90 TL",
    category: "Sıcak İçecekler",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "h2",
    name: "Caffe Latte",
    description: "Espresso ve kremsi süt köpüğü.",
    price: "120 TL",
    category: "Sıcak İçecekler",
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "h3",
    name: "Cappuccino",
    description: "Espresso, yoğun süt ve süt köpüğü.",
    price: "125 TL",
    category: "Sıcak İçecekler",
  },
  {
    id: "h4",
    name: "Americano",
    description: "Espresso ve sıcak suyun sade buluşması.",
    price: "115 TL",
    category: "Sıcak İçecekler",
    image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "h5",
    name: "Bardak Çay",
    description: "Taze demlenmiş Rize çayı.",
    price: "35 TL",
    category: "Sıcak İçecekler",
  },
  {
    id: "h6",
    name: "Bitki Çayları",
    description: "Adaçayı, Ihlamur, Kış Çayı, Yeşil Çay seçekenekleri ile.",
    price: "110 TL",
    category: "Sıcak İçecekler",
    image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=800",
  },

  // --- SOĞUK İÇECEKLER ---
  {
    id: "sd1",
    name: "Ev Yapımı Limonata",
    description: "Taze nane ve limonun ferahlatıcı uyumu.",
    price: "135 TL",
    category: "Soğuk İçecekler",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "sd2",
    name: "Çilekli Limonata",
    description: "Taze çilek püreli ev yapımı limonata.",
    price: "150 TL",
    category: "Soğuk İçecekler",
    image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "sd3",
    name: "Churchill",
    description: "Soda, taze limon suyu ve tuz.",
    price: "85 TL",
    category: "Soğuk İçecekler",
  },
  {
    id: "sd4",
    name: "Iced Latte",
    description: "Espresso, soğuk süt ve buz.",
    price: "130 TL",
    category: "Soğuk İçecekler",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "sd5",
    name: "Coca Cola / Fanta / Sprite",
    description: "Kutu meşrubat seçenekleri.",
    price: "90 TL",
    category: "Soğuk İçecekler",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "sd6",
    name: "Taze Sıkılmış Portakal Suyu",
    description: "Günlük taze portakallardan.",
    price: "155 TL",
    category: "Soğuk İçecekler",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800",
  },

  // --- ALKOLLER ---
  {
    id: "alc1",
    name: "Jack Daniel's (Tek)",
    description: "Old No. 7 Tennessee Whiskey.",
    price: "320 TL",
    category: "Alkoller",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "alc2",
    name: "Yeni Rakı (Tek)",
    description: "Geleneksel anasonlu içecek.",
    price: "220 TL",
    category: "Alkoller",
  },
];

export const CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    title: "Happy Hour",
    description: "Hafta içi her gün 16:00 - 19:00 arası tüm kokteyllerde %20 indirim!",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    category: "Kokteyller"
  },
  {
    id: "c2",
    title: "Fıçı Bira Kampanyası",
    description: "2 adet 50cl fıçı bira alana patates tava hediye!",
    image: "https://images.unsplash.com/photo-1532634896-26909d0d4b89?auto=format&fit=crop&q=80&w=800",
    category: "Biralar"
  },
  {
    id: "c3",
    title: "1+1 Pizza",
    description: "Salı ve Perşembe akşamları seçili pizzalarda bir alana bir bedava!",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
    category: "Pizzalar"
  }
];

export const EVENTS: Event[] = [
  {
    id: "e1",
    title: "DJ Performance: Night Vibes",
    date: "28 Nisan Cuma",
    time: "21:30",
    description: "Görükle'nin en iyi DJ setleri ile geceye hazır olun.",
  },
  {
    id: "e2",
    title: "Live Jazz Night",
    date: "30 Nisan Pazar",
    time: "20:00",
    description: "Bahçemizde huzurlu bir akşam için canlı caz keyfi.",
  }
];
