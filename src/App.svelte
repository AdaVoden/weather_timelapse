<script lang="ts">
 export let latestImageURL: string;
 import "./css/variables.css";
 import "./css/master.css";
 import Player from './Player.svelte';
</script>
<svelte:head>
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
</svelte:head>

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
            <Player/>
        </div>
    </main>
    <footer></footer>
