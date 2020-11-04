<script>
    export let hand;
    export let client;

    import { Heroes, HeroesNames } from './Game.js'

    $: expandedHand = hand.flatMap((v, i, a) => new Array(v).fill(i));

    function handleClick(item) {
        let cardId = item.target.attributes["data-id"].value
        client.moves.PlayCard(cardId)
    }
</script>
<style>
    div {
        display:inline-flex;
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
{#each expandedHand as card}
    <p class="card" data-id={card} on:click="{handleClick}">{HeroesNames[card]}</p>
{/each}
</div>