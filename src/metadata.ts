import { readable, derived, writable } from 'svelte/store';
const intervalCheck: number = 120000; /* 2 minutes */

export const frameRate = writable(5)

function getLatestFilename(url: string): string {
  // TODO: Make this function a promise
  // TODO: Make a buffer system
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

  const latestTime = parseInt(latestImage);

  let totalTime: number;
  if (startTime > latestTime) {
    totalTime = latestTime + startTime;
  } else {
    totalTime = latestTime - startTime;
  }
  console.log(`Latest Time: ${latestTime}`)
  console.log(`Total Time: ${totalTime}`)
  
  // To string since why do math when string manipulation is faster?
  // "faster" being to program, runtime doesn't matter since
  // this should run once per 2 minutes maximum.
  const totalTimeString = String(totalTime).padStart(4, "0");
  // Ensure 4 digits.
  const hours = parseInt(totalTimeString.slice(0, 2));
  const minutes = parseInt(totalTimeString.slice(2, 4));
  console.log(`${hours}:${minutes}`)
  const totalImages = (hours * 30) + Math.round(minutes / 2);
  const playTime = totalImages / frameRate;
  return playTime;
}

export function totalPlaytimeFromStores(latestImage, frameRate, startTime: number) {
  return derived(
    [latestImage, frameRate],
    ([$latestImage, $frameRate]) => calculateTotalPlaytime($latestImage, $frameRate, startTime)
  );
}



