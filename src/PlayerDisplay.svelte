<script>
export let playerId;

import { Client } from 'boardgame.io/client';
import { Local } from 'boardgame.io/multiplayer';
import { TeamFive, count_cards } from './Game.js'
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

let client = Client({
        game: TeamFive,
        multiplayer: Local(),
        playerID: playerId
    });
client.start();
client.subscribe(state => update(state));
$: opponentId = `${(parseInt(playerId)+1)%2}`;
$: opponentHandSize = gameState ? count_cards(gameState.players[opponentId].hand) : 0 ;
$: opponentBoard = gameState ? gameState.players[opponentId].board : undefined;
$: board = gameState ? gameState.players[playerId].board : undefined;
$: hand = gameState ? gameState.players[playerId].hand : undefined;
$: askDefend = Object.keys(ctx.activePlayers).includes(playerId) && ctx.activePlayers[playerId] == "defend";
</script>
<style>
    div {
        display:block;
    }
</style>
<div>Player : {playerId}</div>
{#if gameState}
{#if ctx.currentPlayer==playerId}
<h3>Your turn !</h3>
{:else}
<h3>Wait</h3>
{/if}
{#if askDefend}
<h4>Block card ?</h4>
<button>Yes !</button>
<button>No</button>
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