<script>
export let playerId;

import { Client } from 'boardgame.io/client';
import { Local } from 'boardgame.io/multiplayer';
import { TeamFive, count_cards } from './Game.js'
import OpponentHand from './OpponentHand.svelte';
import PlayerBoard from './PlayerBoard.svelte';
import PlayerHand from './PlayerHand.svelte';
import Discard from './Discard.svelte';

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
    },
    discard: [ 0, 0, 0, 0, 0 ]
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

function handleDefend() {
    let activePlayers = client.getState().ctx.activePlayers;
    if(activePlayers && activePlayers[playerId] == "defend") {   
        client.moves.Defend(); 
    }
}

function handleSkipDefend() {
    let activePlayers = client.getState().ctx.activePlayers;
    if(activePlayers && activePlayers[playerId] == "defend") {   
        client.moves.SkipDefend(); 
    }
}

$: opponentId = `${(parseInt(playerId)+1)%2}`;
$: opponentHandSize = gameState ? count_cards(gameState.players[opponentId].hand) : 0 ;
$: opponentBoard = gameState ? gameState.players[opponentId].board : undefined;
$: board = gameState ? gameState.players[playerId].board : undefined;
$: hand = gameState ? gameState.players[playerId].hand : undefined;
$: discard = gameState ? gameState.discard : undefined;
$: askDisband = ctx.activePlayers && Object.keys(ctx.activePlayers).includes(playerId) && ctx.activePlayers[playerId] == "disband";
$: askRaise = ctx.activePlayers && Object.keys(ctx.activePlayers).includes(playerId) && ctx.activePlayers[playerId] == "raise";
$: askDefend = ctx.activePlayers && Object.keys(ctx.activePlayers).includes(playerId) && ctx.activePlayers[playerId] == "defend";
$: askDiscard = ctx.activePlayers && Object.keys(ctx.activePlayers).includes(playerId) && ctx.activePlayers[playerId] == "discard";
$: moves = Object.keys(client.moves);
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
<div>{moves}</div>
{:else}
<h3>Wait</h3>
{/if}
{#if askDefend}
<h4>Block card ?</h4>
<button on:click={handleDefend}>Yes !</button>
<button on:click={handleSkipDefend}>No</button>
{/if}
{#if askDiscard}
<h4>Please discard !</h4>
{/if}
{#if askRaise}
<h4>Please pick from discard !</h4>
{/if}
{#if askDisband}
<h4>Please pick from opponent board !</h4>
{/if}
<div style="float: left" >
    <Discard {playerId} {discard} {client}></Discard>
</div>
<div>
<OpponentHand bind:nbCards={opponentHandSize}></OpponentHand>
</div>
<div>
<PlayerBoard ownerId={opponentId} board={opponentBoard} {client}></PlayerBoard>
</div>
<div>
<PlayerBoard ownerId={playerId} {board} {client}></PlayerBoard>
</div>
<div>
<PlayerHand {playerId} {client} {hand}></PlayerHand>
</div>
{/if}