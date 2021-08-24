import { readable, derived, writable } from 'svelte/store';
let intervalCheck: number = 120000 /* 2 minutes */
let url: string = "http://136.159.57.131/weatherimages/lastimage"
const testPromise: Promise<string> = new Promise((resolve) => {
  setTimeout(() => {
    resolve('1038');
  }, 50);
});

async function getLatestFilename(url: string): Promise<string> | null {
  const reqHeaders = new Headers();
  const init: Object = {
    method: 'GET',
    headers: reqHeaders,
    mode: 'no-cors',
    cache: 'no-store',
  };
  const webReq: Request = new Request(url, init);
  let result = null;
  try {
    const response = await fetch(webReq);
    result = await response.text();
  } catch(e) {
    result = null
  }
  return result
}

export const latestImage = readable(testPromise, function start(set) {
  const interval = setInterval(() => {
    set(testPromise);
  }, intervalCheck);

  return function stop() {
    clearInterval(interval);
  };
});

async function calculateTotalPlaytime(latestImage: Promise<string>, rate: number): Promise<number> {
  try{
    const digits = await latestImage
    const minutes = parseInt(digits.slice(1));
    const hours = parseInt(digits.slice(0, 2));
    const totalImages = parseFloat((hours * 60 + minutes) / 2);
    const playTime = totalImages/rate;
    return playTime;
  } catch(e){
    return 0;
  }
}

export const frameRate = writable(5)

export const totalPlaytime = derived(
  [latestImage, frameRate],
  ([$latestImage, $frameRate]) => calculateTotalPlaytime($latestImage, $frameRate)
);


