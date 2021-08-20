<script lang="ts">
 export let name: string;
 import Player from './Player.svelte'
</script>

    <header>
        <div class="flex-container">
            <div class="left">
                <h1>Rothney Astrophysical Observatory</h1>
            </div> <!--  end left  -->

            <div class="right">
                <h1>Moonbroch</h1>
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
 /* UofC colours */
 /*
  Primaries:
    red #d6001c
    gold #ffcd00
  Secondaries :
    orange light #ffac300
    orange dark #ff671f
    rubine #ed0a72
    berry #9c0534
  Accents:
    teal #47a67c
    light yellow #ffe57b
    brown #6c3302
    taupe #d3ac8b
  Neutrals:
    black #000000
    dark grey #6d6e71
    light grey #c7c8ca */
 :global(body) {
     width: 100%;
     height:100%;
     margin: 0px;
     padding: 0px;
     font: 1.8rem/1.5
 }
 .grid-container {
     display: grid;
     grid-template-areas:
         "header"
         "content"
         "footer"; /* <! -- optional --> */
     grid-template-columns: 1fr;
     grid-auto-rows: 60px minmax(640px, auto) 100px;

 }
 main {
     grid-area: content;
     display: flex;
     align-items: center;
     justify-content: center;
 }


 header {
     grid-area: header;
     background: #d6001c;
     box-shadow: #6d6e71 0px -0.4rem 0.9rem 0.2rem;
     width: 100%;
     height: 100%;
     margin: 0 auto;
     width: 100vw;
     height: 3rem;
     font-family: Monospace !important;
     -webkit-text-stroke: 0.2px !important;
     text-stroke: 0.2px !important;
 }
 .flex-container {
     display: flex;
     align-items: center;
     justify-content: space-between;
     height:100%;
 }

 .left {
     padding-left: 4vh;
 }

 .right {
     padding-right: 4vh
 }

 footer {
     grid-area: footer;
 }

 h1 {
     color: white;
		 text-transform: uppercase;
		 font-size: 1.5rem;
     font-family: bold;
		 font-weight: 100;
 }
</style>
