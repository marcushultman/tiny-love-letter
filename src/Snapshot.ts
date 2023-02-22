
export type Player = {
  id: string;
  lost: boolean;
  hand: Card<any>[];
  played: Card<any>[];
};

export default interface Snapshot {
  turn: number,
  vask: Card<any>;
  extraVask: Card<any>[];
  deck: Card<any>[];
  players: Player[];
}

export class Card<T> {
  constructor(
    public readonly title: string,
    public readonly value: number,
    public readonly hasModal: boolean,
    public readonly applyAction: (meta: T, snapshot: Snapshot) => void = () => {},
  ) { }
}

export type CardMeta<C extends Card<any>> = C extends Card<infer T> ? T : unknown;

export const GUARD = new Card<{ targetIndex?: number, cardGuess?: number }>(
  'Guard',
  1,
  true,
  ({ targetIndex, cardGuess }, { players }) => {
    const targetPlayer = players[targetIndex ?? -1];
    if (targetPlayer && cardGuess === targetPlayer.hand[0].value) {
      targetPlayer.lost = true;
    }
  },
);
export const PRIEST = new Card('Priest', 2, true);
export const BARON = new Card<{ targetIndex: number }>(
  'Baron',
  3,
  true,
  ({ targetIndex }, { turn, players }) => {
    const me = players[turn];
    const them = players[targetIndex];
    const diff = me.hand[0].value - them.hand[0].value;
    if (diff > 0) {
      them.lost = true;
    } else if (diff < 0) {
      me.lost = true;
    }
  },
);
export const HANDMAID = new Card('Handmaid', 4, false);
export const PRINCE = new Card<{ targetIndex: number }>(
  'Prince',
  5,
  true,
  ({ targetIndex }, { players, deck }) => {
    const player = players[targetIndex];
    if (deck.length > 0) {
      player.hand.push(deck.shift()!);
    }
    const [playedCard] = player.hand.splice(0, 1);
    player.played.push(playedCard);
    if (playedCard.value === PRINCESS.value) {
      player.lost = true;
    }
  }
);
export const KING = new Card<{ targetIndex?: number }>(
  'King',
  6,
  true,
  ({ targetIndex }, { turn, players }) => {
    const me = players[turn];
    const them = players[targetIndex ?? -1];
    if (them) {
      [me.hand, them.hand] = [them.hand, me.hand];
    }
  }
);
export const COUNTESS = new Card('Countess', 7, false, () => {});
export const PRINCESS = new Card<{}>('Princess', 8, false, (_, { turn , players }) => {
  const me = players[turn];
  me.lost = true;
});
