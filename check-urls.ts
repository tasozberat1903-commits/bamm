import { MENU_DATA } from './src/data';
import https from 'https';

async function checkUrls() {
  for (const item of MENU_DATA) {
    if (item.image) {
      const url = item.image;
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (!res.ok) {
          console.log(`BROKEN [${res.status}]: ${item.name} - ${url}`);
        } else {
          console.log(`OK: ${item.name}`);
        }
      } catch (err) {
        console.log(`ERR: ${item.name} - ${url} - ${err.message}`);
      }
    }
  }
}

checkUrls();
