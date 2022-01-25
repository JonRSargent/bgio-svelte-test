<script>
    export let board;
    export let ownerId;
    export let client;

    import { Heroes, HeroesNames } from './Game.js'
    const _indices = new Array(HeroesNames.length).fill(0).map((_1, i, _3) => i);
	$: cards = _indices;

    function handleClick(item) {
        let cardId = item.target.attributes["data-id"].value;
        let currentPlayer = client.getState().ctx.currentPlayer;
        let activePlayers = client.getState().ctx.activePlayers;
        if(activePlayers && activePlayers[currentPlayer] == "disband" && ownerId != currentPlayer) {   
            client.moves.Disband(cardId); 
        }
        else {
            client.moves.PlayCard(cardId);
        }

    }
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
{#each cards as card}
    {#if board[card] > 0}
        <p class="card" data-id={card} on:click="{handleClick}">{HeroesNames[card]}</p>
    {:else}
        <p></p>
    {/if}
{/each}
</div>