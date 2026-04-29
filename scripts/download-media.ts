import fs from 'fs';
import { get } from 'https';

const download = (url: string, path: string) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://imgyukle.com/',
        'Accept': '*/*'
      }
    };
    get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 308) {
        if (!res.headers.location) return reject(new Error('no location'));
        return download(res.headers.location, path).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      const stream = fs.createWriteStream(path);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve(null);
      });
    }).on('error', reject);
  });
};

Promise.all([
    download("https://i.imgyukle.com/2026/04/28/SQVnyR.mp4", "./public/bg-video.mp4"),
    download("https://i.imgyukle.com/2026/04/28/SQVnyR.fr.jpeg", "./public/bg-poster.jpeg")
]).then(() => console.log('Media downloaded successfully'))
.catch(e => console.error('Error downloading:', e));
