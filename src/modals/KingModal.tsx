import Modal from './Modal'
import { CardMeta, HANDMAID, KING, Player } from '../Snapshot';
import Props from './props'
import ListModal from './ListModal'
import './style.scss'

type KingMeta = CardMeta<typeof KING>

export default class KingModal extends ListModal<Props<KingMeta>, {}> implements Modal {
  tryAbort() {
    this.props.onAbort();
  }

  getOtherPlayers() {
    const { players } = this.props.snapshot;
    return players
      .filter(player => player !== this.props.me)
      .filter(player => player.played[player.played.length - 1] !== HANDMAID);
  }

  onPlayerSelected(selectedPlayer: Player) {
    const targetIndex = this.props.snapshot.players.findIndex(player => player.id === selectedPlayer.id);
    this.props.onDone({ targetIndex });
  }

  getList(): { prompt: string; list: any; } {
    const others = this.getOtherPlayers();
    if (!others.length) {
      return {
        prompt: 'All other players protected',
        list: <button onClick={ () => this.props.onDone({}) }>Ok</button>
      };
    }
    return {
      prompt: 'Switcheroo',
      list: others.map(
        player => <button key={ player.id } onClick={ () => this.onPlayerSelected(player)}>
          { player.id.substr(0, 4) }
        </button>
      )
    };
  }
}
