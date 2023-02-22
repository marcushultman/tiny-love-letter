import Modal from './Modal'
import { CardMeta, HANDMAID, Player, PRINCE } from '../Snapshot';
import Props from './props'
import ListModal from './ListModal'
import './style.scss'

type PrinceMeta = CardMeta<typeof PRINCE>

export default class PrinceModal extends ListModal<Props<PrinceMeta>, {}> implements Modal {
  tryAbort() {
    this.props.onAbort();
  }

  getPlayers() {
    const { players } = this.props.snapshot;
    return players
      .filter(player => player === this.props.me || player.played[player.played.length - 1] !== HANDMAID);
  }

  onPlayerSelected(selectedPlayer: Player) {
    const targetIndex = this.props.snapshot.players.findIndex(player => player.id === selectedPlayer.id);
    this.props.onDone({ targetIndex });
  }

  getList(): { prompt: string; list: any; } {
    const players = this.getPlayers();
    return {
      prompt: 'Make them trash their card',
      list: players.map(
        player => <button key={ player.id } onClick={ () => this.onPlayerSelected(player)}>
          { player.id.substr(0, 4) }
        </button>
      )
    };
  }
}
