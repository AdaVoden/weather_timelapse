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


function calculateTotalPlaytime(latestImage: string, frameRate: number, startTime: number): number {

  const latestTime = parseFloat(latestImage);
  let totalTime: number;
  if (startTime > latestTime) {
    totalTime = latestTime + startTime;
  } else {
    totalTime = latestTime - startTime;
  }
  const minutes = Math.floor(totalTime % 60);
  const hours = Math.floor((totalTime - minutes) / 100);
  // divide by 100 to reduce to single/double digits of hours
  const totalImages = (hours * 30) + (minutes / 2);
  const playTime = totalImages / frameRate;
  return playTime;

}
export function totalPlaytimeFromStores(latestImage, frameRate, startTime: number) {
  return derived(
    [latestImage, frameRate],
    ([$latestImage, $frameRate]) => calculateTotalPlaytime($latestImage, $frameRate, startTime)
  );
}



