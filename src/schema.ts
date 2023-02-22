
export interface GuardMeta {
}

export interface Action {
  index: number,
  meta?: GuardMeta | any;
}

export interface GameState {
  seed: number;
  players: string[];
  actions: Action[];
}
