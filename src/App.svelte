<script lang="ts">
 export let latestImageURL: string;
 import "./css/variables.css";
 import "./css/master.css";
 import Player from './Player.svelte';
</script>

    <header>
        <div class="flex-container">
            <div class="left">
                <h1>Rothney Astrophysical Observatory</h1>
            </div> <!--  end left  -->

            <div class="right">
                <h1>Weather Timelapse</h1>
            </div> <!--  end right  -->
        </div> <!--  end header-container  -->
    </header>
    <div class="grid-container" >
    <main>
        <div class="player">
            <Player/>
        </div>
    </main>

    <footer></footer>
</div> <!-- /* end container */ -->

<style>

</style>
