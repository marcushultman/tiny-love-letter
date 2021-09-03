
export interface GuardMeta {
}

export interface Action {
  index: number,
  meta: GuardMeta | any;
}

export interface State {
  seed: number;
  numPlayers: number;
  actions: Action[];
}
