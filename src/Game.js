import { INVALID_MOVE, ActivePlayers } from 'boardgame.io/core';

export const NO_DISCARD = "NO_DISCARD";
export const NO_BOARD = "NO_BOARD"
export const NO_HAND = "NO_HAND"



export const Heroes = {
    Scout: 0,
    Warrior: 1,
    Necro: 2,
    Thief: 3,
    Witch: 4,
}

export const HeroesNames = [
    "Scout",
    "Warrior",
    "Necro",
    "Thief",
    "Witch",
]

export const HeroesPlurals = [
    "Scouts",
    "Warriors",
    "Necros",
    "Thieves",
    "Witches",
]


export const Descriptions = [
    "Scout",
    "Warrior",
    "Necro",
    "Thief",
    "Witch",
]

const cardEffect = [
    (G, ctx) => { EffectDraw(G, ctx, ctx.currentPlayer) }, // Scout : Draw one card
    (G, ctx) => { EffectDisband(G, ctx) }, // Warrior : Force disband
    (G, ctx) => { EffectRaise(G, ctx) }, // Necro : Draw from the discard
    (G, ctx) => { EffectDiscard(G, ctx) }, // Thief : Force discard    
    (G, ctx) => { ctx.events.endTurn(); }, // Witch : Provide defense at the cost of 1 card & the witch
];

function opponent(ctx) {
    return `${(parseInt(ctx.currentPlayer)+1)%2}`;
}

function activePlayer(ctx) {
    if (ctx.activePlayers) {
        return Object.keys(ctx.activePlayers).filter(k => ctx.activePlayers[k]!=null)[0];
    }
    return null;
}


export function count_cards(pack) {
    return pack.reduce((a, b) => a + b, 0);
}

function Draw(G, ctx, player_id) {
    var card_id = ctx.random.Die(5) - 1;
    G.players[player_id].hand[card_id] += 1;
}

function EffectDraw(G, ctx, player_id) {
    Draw(G, ctx, player_id);
    ctx.events.endTurn();
}

function EffectDisband(G, ctx) {
    let opponentId = opponent(ctx)
    if (count_cards(G.players[opponentId].board)>0) {
        ctx.events.setActivePlayers({ currentPlayer: "disband", minMoves: 1, maxMoves: 1});
    }    
    else {
        G.message = NO_BOARD;
        ctx.events.endTurn();
    }
}

function EffectRaise(G, ctx) {
    if (count_cards(G.discard) > 0) {
        ctx.events.setActivePlayers({ currentPlayer: "raise", minMoves: 1, maxMoves: 1});
    }
    else {
        G.message = NO_DISCARD;
        ctx.events.endTurn();
    }
}

function EffectDiscard(G, ctx) {
    let opponentId = opponent(ctx)
    if (count_cards(G.players[opponentId].hand)>0) {
        ctx.events.setActivePlayers({ others: 'discard', minMoves: 1, maxMoves: 1 });
    }
    else {
        G.message = NO_HAND;
        ctx.events.endTurn();
    }
}

function MoveDisband(G, ctx, target_id) {
    let opponentId = opponent(ctx)
    if (G.players[opponentId].board[target_id] == 0)
        return INVALID_MOVE;
    G.players[opponentId].board[target_id] = 0;
    G.discard[target_id] += 1;
    ctx.events.endTurn();
}

function MoveRaise(G, ctx, card_id) {
    if (count_cards(G.discard) == 0) {
    }
    else if (G.discard[card_id] == 0) {
        return INVALID_MOVE;
    }
    else {
        G.discard[card_id] -= 1;
        G.players[ctx.currentPlayer].hand[card_id] += 1;
    }
    ctx.events.endTurn();
}

function MoveDiscard(G, ctx, card_id) {
    let playerId = activePlayer(ctx);
    if (G.players[playerId].hand[card_id] == 0) {
        return INVALID_MOVE;
    }
    G.players[playerId].hand[card_id] -= 1;
    G.discard[card_id] += 1;
    ctx.events.endTurn();
}

function CanDefend(G, ctx) {
    let opponentId = opponent(ctx)
    if (G.players[opponentId].board[Heroes.Witch] == 1) {
        ctx.events.setActivePlayers({ others: 'defend', minMoves: 1, maxMoves: 1});
        return true;
    } else {
        return false;
    }
}

function MoveDefend(G, ctx) {
    let playerId = activePlayer(ctx)
    G.players[playerId].board[Heroes.Witch] = 0;
    G.discard[Heroes.Witch] += 1;
    G.discard[G.played_card] += 1;
    G.played_card = undefined;
    ctx.events.endTurn();
}

function MoveSkipDefend(G, ctx) {
    ApplyCardEffect(G, ctx);
}

function MovePlayCard(G, ctx, card_id) {
    if (G.players[ctx.currentPlayer].hand[card_id] == 0) {
        return INVALID_MOVE;
    }
    G.played_card = card_id;
    G.players[ctx.currentPlayer].hand[card_id] -= 1;
    if (!CanDefend(G, ctx)) {
        ApplyCardEffect(G, ctx)
    }
}

function ApplyCardEffect(G, ctx) {
    let card_id = G.played_card;
    cardEffect[card_id](G, ctx)
    if(G.players[ctx.currentPlayer].board[card_id] == 1) {
        G.discard[card_id] += 1;
    }
    else {
        G.players[ctx.currentPlayer].board[card_id] = 1;
    }    
    G.played_card = undefined;
}

export const TeamFive = {
    setup: () => ({
            players: {
                '0': {
                    board: Array(5).fill(0),
                    hand: Array(5).fill(0),
                },
                '1': {
                    board: Array(5).fill(0),
                    hand: Array(5).fill(0),
                }
            },      
            discard: Array(5).fill(0) 
        }),
    phases: {
        setup: {
            start: true,
            moveLimit: 0,
            onEnd: (G, ctx) => { ctx.playOrder.forEach(i => { Draw(G, ctx, parseInt(i)); Draw(G, ctx, parseInt(i)) }); },
            endIf: (G, ctx) => true,
        },
    },    
    turn: {
        onBegin: (G, ctx) => { 
            G.message = null;
            Draw(G, ctx, parseInt(ctx.currentPlayer));
            ctx.events.setActivePlayers({value: { [ctx.currentPlayer]: "play" } });
        },
        stages: {
            play: {
                moves: { 'PlayCard': MovePlayCard },
            },
            defend: {
                moves: { 'Defend': MoveDefend, "SkipDefend": MoveSkipDefend },
            },
            raise: {
                moves: { 'Raise': MoveRaise },
            },
            disband: {
                moves: { 'Disband': MoveDisband },
            },
            discard: {
                moves: { 'Discard': MoveDiscard },
            },
        },
        onEnd: (G, ctx) => {
            if(G && count_cards(G.players[ctx.currentPlayer].board) == 5)
                ctx.events.endGame(ctx.currentPlayer);
        }
    }
    
};