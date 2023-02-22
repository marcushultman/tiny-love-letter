import Snapshot, { Player } from "../Snapshot";

export default interface Props<T> {
  me: Player;
  snapshot: Snapshot;
  onAbort: () => void;
  onDone: (meta: T) => void | Promise<void>;
};
