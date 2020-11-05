import { INVALID_MOVE, ActivePlayers } from 'boardgame.io/core';

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

const cardEffect = [
    (G, ctx) => { Draw(G, ctx, ctx.currentPlayer) }, // Scout : Draw one card
    (G, ctx) => { Disband(G, ctx) }, // Warrior : Force disband
    (G, ctx) => { Raise(G, ctx) }, // Necro : Draw from the discard
    (G, ctx) => { Discard(G, ctx) }, // Thief : Force discard    
    (G, ctx) => { }, // Witch : Provide defense at the cost of 1 card & the witch
];

function opponent(ctx) {
    return `${(parseInt(ctx.currentPlayer)+1)%2}`;
}

export function count_cards(pack) {
    return pack.reduce((a, b) => a + b, 0);
}

function Draw(G, ctx, player_id) {
    var card_id = ctx.random.Die(5) - 1;
    G.players[player_id].hand[card_id] += 1;
}

function Disband(G, ctx) {
    let opponentId = opponent(ctx)
    if (count_cards(G.players[opponentId].board)>0) {
        ctx.events.setActivePlayers({ currentPlayer: 'disband', moveLimit: 1, revert: true});
    }
}

function PickDisband(G, ctx, target_id) {
    let opponentId = opponent(ctx)
    if (G.players[opponentId].board[target_id] === 0)
        return INVALID_MOVE;
    G.players[opponentId].board[target_id] = 0;
}

function Raise(G, ctx) {
    ctx.events.setStage("raise");
}

function PickRaise(G, ctx, card_id) {
    if (count_cards(G.discard) == 0) {
        ctx.events.endTurn();
    }
    else if (G.discard[card_id] === 0) {
        return INVALID_MOVE;
    }
    else {
        G.discard[card_id] -= 1;
        G.players[ctx.currentPlayer].hand[card_id] += 1;
    }
}

function Discard(G, ctx) {
    let opponentId = opponent(ctx)
    if (count_cards(G.players[opponentId].hand)>0) {
        ctx.events.setActivePlayers({ others: 'discard', moveLimit: 1, revert: true });
    }
}

function PickDiscard(G, ctx, card_id) {
    if (G.players[ctx.currentPlayer].hand[card_id] === 0) {
        return INVALID_MOVE;
    }
    G.players[ctx.currentPlayer].hand[card_id] -= 1;
}

function CanDefend(G, ctx) {
    let opponentId = opponent(ctx)
    if (G.players[opponentId].board[Heroes.Witch] === 1) {
        ctx.events.setActivePlayers({ others: 'defend', moveLimit: 1, revert: true });
        return true;
    } else {
        return false;
    }
}

function Defend(G, ctx) {
    ctx.events.endStage()
}

function SkipDefend(G, ctx) {
    ctx.events.setStage()
}

function PlayCard(G, ctx, card_id) {
    if (G.players[ctx.currentPlayer].hand[card_id] === 0) {
        return INVALID_MOVE;
    }
    G.players[ctx.currentPlayer].hand[card_id] -= 1;
    if (!CanDefend(G, ctx)) {
        cardEffect[card_id](G, ctx)
        G.players[ctx.currentPlayer].board[card_id] += 1;
    }
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
    turn: { 
        moveLimit: 1, 
        activePlayers: ActivePlayers.ALL,
    },
    phases: {
        setup: {
            start: true,
            moveLimit: 0,
            onEnd: (G, ctx) => { ctx.playOrder.forEach(i => { Draw(G, ctx, parseInt(i)); Draw(G, ctx, parseInt(i)) }); },
            endIf: (G, ctx) => true,
            next: "turn",
        },
        turn: {
            onBegin: (G, ctx) => { 
                Draw(G, ctx, parseInt(ctx.currentPlayer));
             },
            moveLimit: 1,
            moves: { 'PlayCard': PlayCard },
            stages: {
                defend: {
                    moves: { 'Defend': Defend, SkipDefend },
                },
                raise: {
                    moves: { 'PickRaise': PickRaise },
                },
                disband: {
                    moves: { 'PickDisband': PickDisband },
                },
                discard: {
                    moves: { 'PickDiscard': PickDiscard },
                },
            },
        }
    },
    
};