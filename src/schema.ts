
export interface GuardMeta {
}

export interface Action {
  index: number,
  meta: GuardMeta | any;
}

export interface State {
  seed: number;
  players: string[];
  actions: Action[];
}
