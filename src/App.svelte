<script>
	import PlayerDisplay from './PlayerDisplay.svelte';

	export let nbPlayers = 2;
	const _players = new Array(nbPlayers).fill(0).map((_1, i, _3) => `${i}`);
	$: players = _players;
</script>

<div id="app" class="app">
	<h1>TeamFive</h1>
	{#each players as playerId}
  		<PlayerDisplay playerId={playerId}></PlayerDisplay>
	{/each}
</div>

<style>
	.app {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		.app {
			max-width: none;
		}
	}
</style>