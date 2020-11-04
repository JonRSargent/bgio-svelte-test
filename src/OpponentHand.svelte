<script>
    export let nbCards;
    $: cardBacks = new Array(nbCards).fill(0);
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
{#each cardBacks as card}
    <p>Cardback</p>
{/each}
</div>