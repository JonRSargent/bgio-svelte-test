<script>
export let playerId;

import { Client } from 'boardgame.io/client';
import { Local } from 'boardgame.io/multiplayer';
import { TeamFive } from './Game.js'
import { onMount } from 'svelte'
import OpponentHand from './OpponentHand.svelte';
import PlayerBoard from './PlayerBoard.svelte';
import PlayerHand from './PlayerHand.svelte';

let ctx = {};
let gameState = {
    players: {
        '0': {
            board: [ 1, 0, 0, 0, 0 ],
            hand: [ 0, 1, 0, 0, 0 ],
        },
        '1': {
            board: [ 1, 0, 1, 0, 0 ],
            hand: [ 0, 1, 0, 1, 0 ],
        }
    }
};

function update(state) {
    gameState = state.G;
    ctx = state.ctx;
}

console.log(playerId)
let client = Client({
        game: TeamFive,
        multiplayer: Local(),
        playerID: playerId
    });
client.start();
client.subscribe(state => update(state));

$: opponentId = (playerId+1)%2;
$: opponentHandSize = gameState ? (gameState.players[opponentId].hand.reduce((prev, curr, ind, arr) => prev + curr, 0)) : 0 ;
$: opponentBoard = gameState ? gameState.players[opponentId].board : undefined;
$: board = gameState ? gameState.players[playerId].board : undefined;
$: hand = gameState ? gameState.players[playerId].hand : undefined;
$: context = Object.keys(ctx).filter(k => !k.startsWith('_')).map((k)=> [k,ctx[k]]);
</script>
<style>
    div {
        display:block;
    }
</style>
<div>Player : {playerId}</div>
{#each context as item}
<div>{item[0]} : {item[1]}</div>
{/each}
{#if gameState}
{#if ctx.currentPlayer==playerId}
<h3>Your turn !</h3>
{:else}
<h3>Wait</h3>
{/if}
<div>
<OpponentHand bind:nbCards={opponentHandSize}></OpponentHand>
</div>
<div>
<PlayerBoard board={opponentBoard}></PlayerBoard>
</div>
<div>
<PlayerBoard board={board}></PlayerBoard>
</div>
<div>
<PlayerHand client={client} hand={hand}></PlayerHand>
</div>
{/if}