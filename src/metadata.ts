import { readable, derived, writable } from 'svelte/store';
let intervalCheck: number = 120000; /* 2 minutes */

export const frameRate = writable(5)

function getLatestFilename(url: string): string {
  let result: string;
  const webReq = new XMLHttpRequest();
  webReq.open("GET", url, false);
  webReq.send(null);
  result = webReq.responseText;
  return result
}

export function latestImageFromURL(url: string) {
  return readable(getLatestFilename(url), function start(set) {
    const interval = setInterval(async () => {
      set(getLatestFilename(url));

    }, intervalCheck);

    return function stop() {
      clearInterval(interval);
    };
  });
}


function calculateTotalPlaytime(latestImage: string, rate: number, startTime: number): number {
  const digits = latestImage.slice(0, 4);
  const latestTime = parseFloat(digits);
  const totalTime = latestTime - startTime;
  const minutes = parseInt(totalTime % 60);
  const hours = parseInt((totalTime - minutes) / 60);
  const totalImages = (hours * 30) + (minutes / 2);
  const playTime = totalImages / rate;
  return playTime;

}
export function totalPlaytimeFromStores(latestImage, frameRate, startTime: number) {
  return derived(
    [latestImage, frameRate],
    ([$latestImage, $frameRate]) => calculateTotalPlaytime($latestImage, $frameRate, startTime)
  );
}



