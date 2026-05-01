const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace('"Kokteyller"', '"İmza Kokteyller", "Klasik Kokteyller"');

const imzaKoks = [
  "PİNK TO BAMM", "Kuzu Kulağı", "Goshra", "Baileys Brule", "Marshmallows", "Rönesans", "Mojito Çilek", 
  "Peach Sprtiz", "Stella", "Romka", "Cherry Kiss", "Chocco Porto", "Apple Gin Fizz", 
  "Jager Soft", "Jager Asid", "Fındık İhtilali", "Baileys Martini", "Bamm Love", "Star of Nights"
];

const classicKoks = [
  "Cuba Libre", "Whiskey Sour", "Margarita", "Sex On The Beach", "Mojito", "LONG İSLAND", "Long Island Iced Tea",
  "COSMOPOLITAN", "Cosmopolitan", "GİNN TONİK", "Gin Tonic", "Espersso Martini", "Espresso Martini", 
  "Hendricks Gin Tonic", "Duble Gin Tonic", "Sangria", "Negroni", "Black Russian", "White Russian", 
  "Tekila Sunrise", "Tequila Sunrise", "Daiquri", "Daiquiri", "Pinacolado", "Pina Colada", 
  "Lynchburg Lemonade", "Aperol Spritz", "Old Fashioned", "Blue Lagoon", "Martini Dry", "Moscow Mule", 
  "Amaretto Sour", "Strawberry Daiquiri", "Bramble", "Manhattan", "Caipirinha", "Bloody Mary", 
  "Passion Fruit Mojito", "Frozen Margarita", "Green Apple Martini", "B52 Shot"
];

let itemsMatched = 0;

let menuBlock = content.match(/export const MENU_DATA[\s\S]+?\];/s);
if (menuBlock) {
  let menuStr = menuBlock[0];
  
  imzaKoks.forEach(name => {
    let regex = new RegExp(`name:\\s*"${name}"[\\s\\S]*?category:\\s*"Kokteyller"`, 'g');
    menuStr = menuStr.replace(regex, (match) => {
      itemsMatched++;
      return match.replace('"Kokteyller"', '"İmza Kokteyller"');
    });
  });

  classicKoks.forEach(name => {
    let regex = new RegExp(`name:\\s*"${name}"[\\s\\S]*?category:\\s*"Kokteyller"`, 'g');
    menuStr = menuStr.replace(regex, (match) => {
      itemsMatched++;
      return match.replace('"Kokteyller"', '"Klasik Kokteyller"');
    });
  });

  menuStr = menuStr.replace(/category:\s*"Kokteyller"/g, 'category: "Klasik Kokteyller"');

  content = content.replace(menuBlock[0], menuStr);
}

content = content.replace(/category:\s*"Kokteyller"(.*?)/g, 'category: "İmza Kokteyller"$1');
content = content.replace(/category: "Kokteyller"/g, 'category: "İmza Kokteyller"');

fs.writeFileSync('src/data.ts', content);
console.log("Done matches: " + itemsMatched);
