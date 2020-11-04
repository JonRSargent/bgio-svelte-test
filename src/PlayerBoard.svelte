<script>
    export let board;
    import { Heroes, HeroesNames } from './Game.js'

</script>
<style>
    div {
        display:inline-flex;
    }
    p.card {
        border-width: 0.4mm;
    }    
    p {
        display:inline-flex;
        height: 3.28cm;
        width: 2.32cm;
        border-style: solid;
        border-width: 0.2mm;
        border-color: black;
        border-radius: 2mm;
        margin: 2mm;
        justify-content: center;
        align-items: center;
    }
</style>
<div>
{#each HeroesNames as hero}
    {#if board[Heroes[hero]] > 0}
        <p class="card">{hero}</p>
    {:else}
        <p></p>
    {/if}
{/each}
</div>