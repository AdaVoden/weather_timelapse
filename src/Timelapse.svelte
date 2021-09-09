<script lang="ts">
 import { writable } from 'svelte/store'
 import { totalPlaytimeFromStores, frameRate, latestImageFromURL } from './metadata.ts'
 export let paused = true;
 export let time;
 export let allsky;
 export let totalPlaytime;
 let baseURL = "/images";
 let allSkyFolder = "AllSkyCamImages";
 let weatherFolder = "WeatherCamImages";
 let url;
 let playStartTime;
 let latestImage;
 let timelapse;
 let img;
 const millisecondsPerFrame = 1000/$frameRate;
 const secondsPerFrame = millisecondsPerFrame/1000;
 // TODO: fix double initialization
 // TODO: fix double play/seek behaviour
 // Before mounting setup
 if (allsky) {
     playStartTime = 1200;
     setupTimelapse(allSkyFolder, playStartTime);
 } else {
     playStartTime = 500;
     setupTimelapse(weatherFolder, playStartTime);
 }


 $: if (allsky) {
     setupTimelapseVariables(allSkyFolder, 1200);
     timelapse.resetStartPoint();

 } else {
     setupTimelapseVariables(weatherFolder, 500);
     timelapse.resetStartPoint();
 }


 $: if (paused) {
     timelapse.pause();
 } else {
     timelapse.play();
 }

 $: timelapse.seek(time);


 function imageFilenameFromNumber(imageNumber: number){
     let filename = String(imageNumber);
     return `${filename.padStart(4, "0")}.jpg`;
 }

 function nextImageFilename(currentImage: string, latestImage: string): string {
     currentImage = currentImage.split("/").at(-1);
     latestImage = latestImage.split("/").at(-1);
     // Just in case we're passed in full URLs
     currentImage = (currentImage).split(".")[0];
     latestImage = (latestImage).split(".")[0];
     let nextImage = parseInt(currentImage) + 2;
     let latestImageNum = parseInt(latestImage)
     nextImage = clampImageNumber(nextImage);
     if (nextImage >= latestImageNum) {
         // Never go past latest image
         nextImage = latestImageNum;
     }
     let resultNumber = imageFilenameFromNumber(nextImage);
     return `${url}${resultNumber}`
 }

 function clampImageNumber(num: number){
     num = roundToEven(num);
     const digits = String(num).split('');
     if (digits.length >= 2) {
         digits.pop(); // get rid of single minutes
         const tensOfMinutes = digits.pop();
         if (parseInt(tensOfMinutes) >= 6) {
             num -= 60;
             num += 100;
         }
     }
     if (num > 2400) {
         // Reset just in case
         num = 0;
     }
     return num;
 }

 function roundToEven(num: number) {
     num = Math.floor(num); // No floats
     if (num % 2 === 1) {
         num = parseInt(num - 1);
     }
     return num;
 }

 function imageFilenameFromTime(time: number, frameRate: number): string {
     const currentFrame = time * frameRate;
     const totalFrameMinutes = currentFrame * 2;
     const hours = Math.floor(totalFrameMinutes / 60);
     const minutes = Math.floor(totalFrameMinutes % 60);
     const frameTime = hours * 100 + minutes;
     // * 100 so it's in digit slot 3, or 3 and 4;
     const imageTime = clampImageNumber(frameTime + playStartTime);
     const imageFilename = imageFilenameFromNumber(imageTime);
     return imageFilename;
 }

 function createTimelapse(startPoint: string) {
     const { subscribe, set, update } = writable(url + startPoint);
     let interval;

     function play() {
         interval = setInterval(() => {
             next();
         }, millisecondsPerFrame);
     }

     function pause() {
         clearInterval(interval);
     }

     function seek(time: number) {
         if (time < 0) {time = 0};
         if (time < $totalPlaytime) {
             let seekTo = url + imageFilenameFromTime(time, $frameRate);
             set(seekTo);
         }
     }
     function next(){
         if (time < $totalPlaytime) {
             update(n => nextImageFilename(n, $latestImage));
             time = time + secondsPerFrame;
         };
     }

     function resetStartPoint(){
         pause();
         let seekTo = url + imageFilenameFromNumber(playStartTime);
         set(seekTo);
     }

     return {
         subscribe,
         play: () => play(),
         pause: () => pause(),
         seek: (time: number) => seek(time),
         resetStartPoint: () => resetStartPoint(),
         next: () => next(),
     };

 }

 function setupTimelapseVariables(imageFolder: string, startPoint: number) {
     if (typeof timelapse !== 'undefined') {
         timelapse.pause();
     }
     playStartTime = startPoint;
     url = `${baseURL}/${imageFolder}/`;
     latestImage = latestImageFromURL(url + "lastimage");
     totalPlaytime = totalPlaytimeFromStores(latestImage, frameRate, startPoint);
     time = 0;
 }

 function setupTimelapse(imageFolder: string, startPoint: number) {
     setupTimelapseVariables(imageFolder, startPoint);
     const startFilename = imageFilenameFromNumber(startPoint);
     timelapse = createTimelapse(startFilename);
 }


</script>
<img draggable="false"
     src={$timelapse}
                alt="Timelapse" />
