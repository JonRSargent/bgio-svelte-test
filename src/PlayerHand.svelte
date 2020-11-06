<script>

    export let playerId;
    export let hand;
    export let client;

    import { HeroesNames } from './Game.js'

    $: expandedHand = hand.flatMap((v, i, _3) => new Array(v).fill(i));

    function handleClick(item) {
        let cardId = item.target.attributes["data-id"].value;
        let activePlayers = client.getState().ctx.activePlayers;
        if(activePlayers && activePlayers[playerId] == "discard") {   
            client.moves.Discard(cardId); 
        }
        else {
            client.moves.PlayCard(cardId);
        }

    }
</script>
<style>
    .container {
        display:inline-flex;
    }
    .card {
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
<div class="container">
{#each expandedHand as card}
    <p class="card" data-id={card} on:click="{handleClick}">{HeroesNames[card]}</p>
{/each}
</div>