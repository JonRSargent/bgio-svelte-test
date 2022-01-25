<script>

    export let playerId;
    export let discard;
    export let client;

    import { Heroes, HeroesNames, HeroesPlurals } from './Game.js'
	const _indices = new Array(HeroesNames.length).fill(0).map((_1, i, _3) => i);
	$: cards = _indices;
	$: discard = discard;

    function handleClick(item) {
        let cardId = item.target.attributes["data-id"].value;
        let activePlayers = client.getState().ctx.activePlayers;
        if(activePlayers && activePlayers[playerId] == "discard") {   
            client.moves.Discard(cardId); 
        }
        else if(activePlayers && activePlayers[playerId] == "raise") {   
            client.moves.Raise(cardId); 
        }
    }
</script>
<style>
    .container {
        display:flex;
        flex-direction: column;
    }
    .card {
        display:flex;
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
<div class="container">
{#each cards as card}
    <p class="card" data-id={card} on:click="{handleClick}">{discard[card]} 
        {#if discard[card]>1}
            {HeroesPlurals[card]}
        {:else}
            {HeroesNames[card]}
        {/if}
    </p>
{/each}
</div>