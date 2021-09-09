<script lang="ts">
 import "./css/variables.css";
 import "./css/master.css";
 import Player from './Player.svelte';
 let toggle: boolean = false;
 if (__timelapseVariant__ === "allsky") {

     toggle = true;
 }

</script>

<header class="flex-container row">
    <div class="left">
        <img src="/timelapse/{__timelapseVariant__}/uc-rothney.png" class="header-img" alt="University of Calgary logo" />
    </div> <!--  end left  -->

    <div class="right">
        <h1>{toggle ? "AllSky" : "Weather"} Timelapse</h1>
    </div> <!--  end right  -->
</header><!--  end flex-container  -->


<main class="flex-container column">
    <div class="player">
        <Player allsky={toggle} />
    </div>

    <!-- <input type="checkbox" bind:checked={toggle} name="allsky" id="allsky" />
         <label for="allsky" class=" {toggle ? "flex-left" : "flex-right"}">
         <h2 class="{toggle ? "text-left" : "text-right"}">
         {toggle ? "AllSkyCam" : "WeatherCam"}
         </h2>

         </label> -->
</main>

<footer></footer>

<!-- <style>
     input {
     visibility: hidden;
     width: 0;
     height: 0;
     }
     label {
     display: block;
     width: 12rem;
     height: 50px;
     background-color: var(--secondary-dark-orange);
     border-radius: 100px;
     position: relative;
     cursor: pointer;
     box-shadow: 0 0 5px  var(--neutral-dark-grey);
     }

     label::after {
     content: "";
     width: 40px;
     height: 40px;
     background-color: white;
     position: absolute;
     border-radius: 25px;
     top: 5px;
     left: 5px;
     transition: 0.5s;
     }
     input:checked + label:after {
     left: calc(100% - 5px);
     transform: translateX(-100%);
     }
     input:checked + label {
     background-color: var(--secondary-berry);
     }
     label:active:after {
     width: 160px;
     }
     h2 {
     font-size: 1rem;
     position: relative;
     color:  white;
     user-select: none;
     }
     .flex-right {
     display: flex;
     flex-direction: row;
     justify-content: right;
     }
     .flex-left {
     display: flex;
     flex-direction: row;
     justify-content: left;
     }
     .text-left {
     left: 15px;
     }
     .text-right {
     right: 15px;
     }


     </style> -->
