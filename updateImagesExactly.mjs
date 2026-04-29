import fs from 'fs';

const IMAGE_MAP = {
    "BAMM Burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    "PİNK TO BAMM": "https://images.unsplash.com/photo-1536935338218-d413d7240bc5?auto=format&fit=crop&q=80&w=800",
    "BAMM Combo Tabağı": "https://images.unsplash.com/photo-1626074353765-517a681e52ee?auto=format&fit=crop&q=80&w=800",
    "Turkish Breakfast (Serpme)": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800",
    "American Breakfast": "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&q=80&w=800",
    "Croissant Classico": "https://images.unsplash.com/photo-1555507015-cbddcc1161ee?auto=format&fit=crop&q=80&w=800",
    "Morning Burger": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
    "Kahvaltı Tabağı": "https://images.unsplash.com/photo-1533089859715-68fffcab10e3?auto=format&fit=crop&q=80&w=800",
    "Çıtır Tavuk Parçaları": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800",
    "BAMM Patates": "https://images.unsplash.com/photo-1576107232684-1279f39085d1?auto=format&fit=crop&q=80&w=800",
    "Mozzarella Sticks": "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&q=80&w=800",
    "Bazlama Tost": "https://images.unsplash.com/photo-1619860860774-1e2e1734adced?auto=format&fit=crop&q=80&w=800",
    "Karışık Tost": "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&q=80&w=800",
    "Kaşarlı Tost": "https://images.unsplash.com/photo-1475090169767-40ed8d18f67d?auto=format&fit=crop&q=80&w=800",
    "Tavuklu Dürüm": "https://images.unsplash.com/photo-1565299507177-b0da71c4c114?auto=format&fit=crop&q=80&w=800",
    "Köfteli Dürüm": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
    "Power Bowl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
    "Cheeseburger": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
    "Chicken Burger": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=800",
    "BAMM Karışık Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
    "Pizza Margherita": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800",
    "Penne Arabiatta": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=800",
    "Spaghetti Bolognese": "https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&q=80&w=800",
    "Hellim Salata": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
    "Tavuklu Sezar Salata": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=800",
    "Tavuk Schnitzel": "https://images.unsplash.com/photo-1598514982205-f36bcda7cd1d?auto=format&fit=crop&q=80&w=800",
    "Izgara Köfte": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=800",
    "Beğendili Kebap": "https://images.unsplash.com/photo-1605333396914-2314dce11a7f?auto=format&fit=crop&q=80&w=800",
    "Mantar Soslu Tavuk": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800",
    "Cafe de Paris Steak": "https://images.unsplash.com/photo-1544025162-817ebc10b7b1?auto=format&fit=crop&q=80&w=800",
    "San Sebastian Cheesecake": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800",
    "Sufle": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800",
    "Kuzu Kulağı": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    "Rönesans": "https://images.unsplash.com/photo-1587223075055-82e9a937ddff?auto=format&fit=crop&q=80&w=800",
    "Cuba Libre": "https://images.unsplash.com/photo-1615887023516-9b6bcd559e47?auto=format&fit=crop&q=80&w=800",
    "Whiskey Sour": "https://images.unsplash.com/photo-1615887110731-01f13b6329e1?auto=format&fit=crop&q=80&w=800",
    "Margarita": "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&q=80&w=800",
    "Sex On The Beach": "https://images.unsplash.com/photo-1536935338686-2dc2fcb1b22e?auto=format&fit=crop&q=80&w=800",
    "Mojito": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800",
    "Long Island Iced Tea": "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80&w=800",
    "Cosmopolitan": "https://images.unsplash.com/photo-1647413661556-3c08b51d8b67?auto=format&fit=crop&q=80&w=800",
    "Gin Tonic": "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?auto=format&fit=crop&q=80&w=800",
    "Goshra": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    "Espresso Martini": "https://images.unsplash.com/photo-1625244724120-1fd1d3321c25?auto=format&fit=crop&q=80&w=800",
    "Baileys Brule": "https://images.unsplash.com/photo-1608665096538-278ce09de4e7?auto=format&fit=crop&q=80&w=800",
    "Star of Nights": "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=800",
    "Bamm Love": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    "Mojito Çilek": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    "Marshmallows": "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&q=80&w=800",
    "Lynchburg Lemonade": "https://images.unsplash.com/photo-1536935338773-84649bb09f10?auto=format&fit=crop&q=80&w=800",
    "Aperol Spritz": "https://images.unsplash.com/photo-1560506840-02ba40fbc358?auto=format&fit=crop&q=80&w=800",
    "Negroni": "https://images.unsplash.com/photo-1588767768106-1b20e51d9d68?auto=format&fit=crop&q=80&w=800",
    "Old Fashioned": "https://images.unsplash.com/photo-1601931818169-1c6fd1ffeb22?auto=format&fit=crop&q=80&w=800",
    "Blue Lagoon": "https://images.unsplash.com/photo-1587223075055-82e9a937ddff?auto=format&fit=crop&q=80&w=800",
    "Tequila Sunrise": "https://images.unsplash.com/photo-1615887110731-01f13b6329e1?auto=format&fit=crop&q=80&w=800",
    "Martini Dry": "https://images.unsplash.com/photo-1575037614876-c3cc1e411082?auto=format&fit=crop&q=80&w=800",
    "Moscow Mule": "https://images.unsplash.com/photo-1595981267035-7b04d84b6f17?auto=format&fit=crop&q=80&w=800",
    "Pina Colada": "https://images.unsplash.com/photo-1573081079379-cb4a3e9c5e3d?auto=format&fit=crop&q=80&w=800",
    "Amaretto Sour": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800",
    "White Russian": "https://images.unsplash.com/photo-1560506840-02ba40fbc358?auto=format&fit=crop&q=80&w=800",
    "Black Russian": "https://images.unsplash.com/photo-1588767768106-1b20e51d9d68?auto=format&fit=crop&q=80&w=800",
    "Daiquiri": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    "Strawberry Daiquiri": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    "Bramble": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    "Manhattan": "https://images.unsplash.com/photo-1601931818169-1c6fd1ffeb22?auto=format&fit=crop&q=80&w=800",
    "Caipirinha": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800",
    "Bloody Mary": "https://images.unsplash.com/photo-1528699633788-424224dc89b5?auto=format&fit=crop&q=80&w=800",
    "Passion Fruit Mojito": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    "Frozen Margarita": "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&q=80&w=800",
    "Green Apple Martini": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800",
    "B52 Shot": "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?auto=format&fit=crop&q=80&w=800",
    "Efes Pilsen Fıçı (50cl)": "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=800",
    "Bomonti Filtresiz (50cl)": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800",
    "Weihenstephaner Vitus (50cl)": "https://images.unsplash.com/photo-1614316654498-8ec1f79ea12b?auto=format&fit=crop&q=80&w=800",
    "Türk Kahvesi": "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800",
    "Caffe Latte": "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&q=80&w=800",
    "Cappuccino": "https://images.unsplash.com/photo-1534040385115-332cb5c64625?auto=format&fit=crop&q=80&w=800",
    "Americano": "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&q=80&w=800",
    "Bardak Çay": "https://images.unsplash.com/photo-1544787219-7f47ccb7fae6?auto=format&fit=crop&q=80&w=800",
    "Bitki Çayları": "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=800",
    "Ev Yapımı Limonata": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    "Çilekli Limonata": "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80&w=800",
    "Churchill": "https://images.unsplash.com/photo-1615887023516-9b6bcd559e47?auto=format&fit=crop&q=80&w=800",
    "Iced Latte": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800",
    "Coca Cola / Fanta / Sprite": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800",
    "Taze Sıkılmış Portakal Suyu": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800",
    "Jack Daniel's (Tek)": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
    "Yeni Rakı (Tek)": "https://images.unsplash.com/photo-1625244724120-1fd1d3321c25?auto=format&fit=crop&q=80&w=800",
};

let content = fs.readFileSync('src/data.ts', 'utf8');
let output = '';
let inMenuData = false;
let currentName = '';
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    if (line.includes('export const MENU_DATA')) {
        inMenuData = true;
    }
    if (line.includes('export const CAMPAIGNS')) {
        inMenuData = false;
    }
    
    if (inMenuData) {
        const nameMatch = line.match(/name:\s*"([^"]+)"/);
        if (nameMatch) {
            currentName = nameMatch[1];
        }
        
        if (line.includes('image:')) {
            if (currentName && IMAGE_MAP[currentName]) {
                line = line.replace(/image:\s*"[^"]+"/, `image: "${IMAGE_MAP[currentName]}"`);
            }
        }
    }
    
    output += line;
    if (i < lines.length - 1) output += '\n';
}

fs.writeFileSync('src/data.ts', output);
console.log('Images updated based on exact names.');
