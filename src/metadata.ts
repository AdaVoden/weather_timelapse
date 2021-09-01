import { readable, derived, writable } from 'svelte/store';
let intervalCheck: number = 120000; /* 2 minutes */
let url: string = "/images/WeatherCamImages/lastimage"

export const frameRate = writable(10)

function getLatestFilename(url: string): string {
  let result: string;
  const webReq = new XMLHttpRequest();
  webReq.open("GET", url, false);
  webReq.send(null);
  result = webReq.responseText;
  return result
}

export const latestImage = readable(getLatestFilename(url), function start(set) {
  const interval = setInterval(async () => {
    set(getLatestFilename(url));
    
  }, intervalCheck);

  return function stop() {
    clearInterval(interval);
  };
});

function calculateTotalPlaytime(latestImage: string, rate: number) {

  const digits = latestImage
  const minutes = parseInt(digits.slice(1));
  const hours = parseInt(digits.slice(0, 2));
  const totalImages = parseFloat((hours * 60 + minutes) / 2);
  const playTime = totalImages / rate;
  return playTime;

}

export const totalPlaytime = derived(
  [latestImage, frameRate],
  ([$latestImage, $frameRate]) => calculateTotalPlaytime($latestImage, $frameRate)
);


