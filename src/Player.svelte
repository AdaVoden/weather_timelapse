<script lang="ts">
 // These values are bound to properties of the video
 import { writable} from 'svelte/store'
 import { totalPlaytimeFromStores, frameRate, latestImageFromURL } from './metadata'
 export let allsky = false;
 let baseURL = "/images/";
 let url: string;
 let totalPlaytime;
 let latestImage;
 let timelapse;
 let time = 0;
 let paused = true;
 let duration: number;
 $: if (allsky) {
     setupTimelapse("AllSkyCamImages");

 } else {
     setupTimelapse("WeatherCamImages");

 }

 const millisecondsPerFrame = 1000/$frameRate;
 const secondsPerFrame = millisecondsPerFrame/1000;

 let showControls = true;
 let showControlsTimeout;

 // Used to track time of last mouse down event
 let lastMouseDown;

 function setupTimelapse(imageFolder: string) {
     if (typeof timelapse !== 'undefined') {
         timelapse.pause();

         paused = true;
     }
     url = baseURL + imageFolder + "/";

     latestImage = latestImageFromURL(url + "lastimage");

     totalPlaytime = totalPlaytimeFromStores(latestImage, frameRate);
     duration = $totalPlaytime;
     time = 0;

     timelapse = createTimelapse();
 }

 function createTimelapse() {
     const { subscribe, set, update } = writable(url + "0000.jpg");
     let interval;

     function play() {
         interval = setInterval(() => {
             if (time < duration) {
                 update(n => nextImageFilename(n, $latestImage));
                 time = time + secondsPerFrame;
             };
         }, millisecondsPerFrame);
     }

     function pause() {
         clearInterval(interval);
     }

     function seek(time: number) {
         if (time < 0) {time = 0};
         let seekTo = url + imageFilenameFromTime(time, duration, $frameRate);
         set(seekTo);
     }

     return {
         subscribe,
         play: () => play(),
         pause: () => pause(),
         seek: (time: number) => seek(time)
     };

 }


 function handleMove(e) {
     // Make the controls visible, but fade out after
     // 2.5 seconds of inactivity
     clearTimeout(showControlsTimeout);
     showControlsTimeout = setTimeout(() => showControls = false, 2500);
     showControls = true;

     if (!duration) return; // video not loaded yet
     if (e.type !== 'touchmove' && !(e.buttons & 1)) return; // mouse not down
     const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
     const {
         left,
         right
     } = this.getBoundingClientRect();
     time = duration * (clientX - left) / (right - left);
     timelapse.seek(time);
 }

 // we can't rely on the built-in click event, because it fires
 // after a drag — we have to listen for clicks ourselves
 function handleMousedown(e) {
     lastMouseDown = new Date();
 }

 function handleMouseup(e) {
     if (new Date() - lastMouseDown < 300) { //Play on click
         if (paused) {
             paused = false
             timelapse.play()
         } else {
             paused = true
             timelapse.pause()
         };
     }

 }

 function format(seconds) {
     if (isNaN(seconds)) return '...';

     const minutes = Math.floor(seconds / 60);
     seconds = Math.floor(seconds % 60);
     if (seconds < 10) seconds = '0' + seconds;

     return `${minutes}:${seconds}`;
 }

 function imageFilenameFromTime(time: number, totalTime: number, frameRate: number): string {
     const currentPosFraction = time/totalTime;
     const totalImages = totalTime * frameRate * 2;
     const currentImage = currentPosFraction * totalImages;
     let imageMinutes = parseInt(currentImage % 60);
     if(imageMinutes % 2 === 1) { // Because one image per two minutes
         imageMinutes = imageMinutes - 1;
     }
     const imageHours = parseInt((currentImage - imageMinutes) / 60);
     const minuteString = ("" + imageMinutes).padStart(2, "0");
     const hourString = ("" + imageHours).padStart(2, "0");
     const imageFilename = hourString + minuteString + ".jpg";
     return imageFilename;
 }

 function nextImageFilename(currentImage: string, latestImage: string): string {
     currentImage = currentImage.split("/").at(-1);
     console.log(currentImage);
     currentImage = ( currentImage).split(".")[0];
     latestImage = ( latestImage).split(".")[0];
     let nextImage = parseInt(currentImage) + 2;
     let latestImageNum = parseInt(latestImage)
     let result: string;
     if (((nextImage - 60) % 100) === 0 && nextImage !== 0) {
         nextImage -= 60;
         nextImage += 100;
     }
     if (nextImage >= latestImageNum) {
         nextImage = latestImageNum;
     }
     result = "" + nextImage;
     result = `${url}${result.padStart(4, "0")}.jpg`;
     return result;

 }
</script>

<div>

    <img draggable="false" src={$timelapse}
                    on:mousemove={handleMove}
         on:touchmove|preventDefault={handleMove}
                    on:mousedown={handleMousedown}
         on:mouseup={handleMouseup}
    alt="Timelapse" />

    <div class="controls" style="opacity: {duration && showControls ? 1 : 0}">

        <div class="info">
            <span class="time">{format(time)}</span>
            <span>click anywhere to {paused ? 'play' : 'pause'} / drag to seek</span>
            <span class="time">{format(duration)}</span>
        </div>

        <progress value="{time/duration || 0}" />



    </div>
</div>

<style>
 div {
     position: relative;
 }

 .controls {
     position: absolute;
     bottom: 0;
     width: 100%;
     transition: opacity 1s;
 }

 .info {
     display: flex;
     width: 100%;
     justify-content: space-between;
 }

 span {
     padding: 0.2em 0.5em;
     color: white;
     text-shadow: 0 0 8px #000000;
     font-size: 1.4em;
     opacity: 0.7;
 }

 .time {
     width: 3em;
 }

 .time:last-child {
     text-align: right
 }

 progress {
     display: block;
     width: 100%;
     height: 10px;
     -webkit-appearance: none;
     appearance: none;
 }

 progress::-webkit-progress-bar {
     background-color: rgba(0, 0, 0, 0.2);
 }

 progress::-webkit-progress-value {
     background-color: rgba(255, 255, 255, 0.6);
 }

 img {
     width: 100%;
     box-shadow: 0.4rem 0.4rem 1rem 0.01rem #c7c8ca;
 }
</style>
