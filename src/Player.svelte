<script lang="ts">
 // These values are bound to properties of the video
 import { writable} from 'svelte/store'
 import Timelapse from './Timelapse.svelte'
 export let allsky = false;
 let time = 0;
 let paused = true;
 let duration;

 let showControls = true;
 let showControlsTimeout;

 // Used to track time of last mouse down event
 let lastMouseDown;

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
     time = $duration * (clientX - left) / (right - left);
 }

 // we can't rely on the built-in click event, because it fires
 // after a drag — we have to listen for clicks ourselves
 function handleMousedown(e) {
     lastMouseDown = new Date();
 }

 function handleMouseup(e) {
     // TODO handle distance dragged
     if (new Date() - lastMouseDown < 300) {
         //Play on click
         if (paused) {
             paused = false
         } else {
             paused = true
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
</script>

<div  on:mousemove={handleMove}
                   on:touchmove|preventDefault={handleMove}
      on:mousedown={handleMousedown}
                   on:touchstart|preventDefault={handleMousedown}
      on:touchend|preventDefault={handleMouseup}
                   on:mouseup={handleMouseup}>

    <Timelapse
        paused={paused}
               bind:time={time}
        allsky={allsky}
               bind:totalPlaytime={duration} />

    <div class="controls" style="opacity: {$duration && showControls ? 1 : 0}">

        <div class="info">
            <span class="time">{format(time)}</span>
            <span>click anywhere to {paused ? 'play' : 'pause'} / drag to seek</span>
            <span class="time">{format($duration)}</span>
        </div>

        <progress value="{time/$duration || 0}" />



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
