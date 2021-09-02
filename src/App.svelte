<script lang="ts">
 import "./css/variables.css";
 import "./css/master.css";
 import Player from './Player.svelte';
 let toggle: boolean = false;

</script>


<header class="flex-container row">
        <div class="left">
            <h1>Rothney Astrophysical Observatory</h1>
        </div> <!--  end left  -->

        <div class="right">
            <h1>Weather Timelapse</h1>
        </div> <!--  end right  -->
</header><!--  end flex-container  -->


    <main class="flex-container column">
        <div class="player">
            <Player allsky={toggle} />
        </div>
        <div class="toggle">
            <input type="checkbox" bind:checked={toggle} name="allsky" />
            <label for="allsky">{toggle ? "All Sky" : "Weather"}
        </div>
    </main>
    <footer></footer>

    <style>


    </style>
