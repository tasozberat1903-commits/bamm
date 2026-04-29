import fs from 'fs';

const data = fs.readFileSync('src/data.ts', 'utf8');
const regex = /name:\s*"([^"]+)",/g;
let match;
const products = [];
while ((match = regex.exec(data)) !== null) {
  products.push(match[1]);
}
console.log(products.join('\n'));
