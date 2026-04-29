import fs from 'fs';

const CATEGORY_IMAGES = {
    "Kahvaltı": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800",
    "Atıştırmalıklar": "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&q=80&w=800",
    "Tost & Sandviç": "https://images.unsplash.com/photo-1619860860774-1e2e1734adced?auto=format&fit=crop&q=80&w=800",
    "Dürümler & Bowl": "https://images.unsplash.com/photo-1565299507177-b0da71c4c114?auto=format&fit=crop&q=80&w=800",
    "Pizzalar": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800",
    "Makarnalar": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=800",
    "Salatalar": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
    "Ana Yemekler": "https://images.unsplash.com/photo-1544025162-817ebc10b7b1?auto=format&fit=crop&q=80&w=800",
    "Tatlılar": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800",
    "Kokteyller": "https://images.unsplash.com/photo-1536935338686-2dc2fcb1b22e?auto=format&fit=crop&q=80&w=800",
    "Biralar": "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=800",
    "Sıcak İçecekler": "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800",
    "Soğuk İçecekler": "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=800",
    "Alkoller": "https://images.unsplash.com/photo-1560506840-02ba40fbc358?auto=format&fit=crop&q=80&w=800",
    "Burgerler": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&q=80&w=800",
};

let content = fs.readFileSync('src/data.ts', 'utf8');
let output = '';
let inMenuData = false;
let currentCategory = '';
let currentImage = '';
const lines = content.split('\n');

for(let i=0; i<lines.length; i++) {
   if (lines[i].includes('export const MENU_DATA')) {
      inMenuData = true;
   }
   if (lines[i].includes('export const CAMPAIGNS')) {
      inMenuData = false;
   }

   if (inMenuData) {
       const catMatch = lines[i].match(/category:\s*"([^"]+)"/);
       if (catMatch) {
            currentCategory = catMatch[1];
       }
       if (lines[i].includes('image:')) {
            currentImage = 'exists';
       }
       if (lines[i].trim() === '},' || (lines[i].trim() === '}' && lines[i+1]?.trim() === '];')) {
            if (!currentImage && currentCategory) {
                let img = CATEGORY_IMAGES[currentCategory] || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800";
                output += `    image: "${img}",\n`;
            }
            currentCategory = '';
            currentImage = '';
       }
   }
   output += lines[i];
   if(i < lines.length - 1) output += '\n';
}
fs.writeFileSync('src/data.ts', output);
console.log("Images added.");
