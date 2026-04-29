import fs from 'fs';
import { MENU_DATA } from './src/data';

async function fixBrokenLinks() {
  let fileContent = fs.readFileSync('./src/data.ts', 'utf8');

  for (const item of MENU_DATA) {
    if (item.image) {
      try {
        const res = await fetch(item.image, { method: 'HEAD' });
        if (!res.ok) {
          // It's broken, remove the 'image' property from the file for this item name.
const imageEscaped = item.image.replace(/[.*+?^$\{\}()|\[\]\\]/g, '\\$&');
const regex = new RegExp(`[\\s]*image:[\\s]*["']${imageEscaped}["'],?`, 'g');
fileContent = fileContent.replace(regex, '');
        }
      } catch (err) {
        const imageEscaped = item.image.replace(/[.*+?^$\{\}()|\[\]\\]/g, '\\$&');
        const regex = new RegExp(`[\\s]*image:[\\s]*["']${imageEscaped}["'],?`, 'g');
        fileContent = fileContent.replace(regex, '');
      }
    }
  }

  fs.writeFileSync('./src/data.ts', fileContent);
}

fixBrokenLinks();
