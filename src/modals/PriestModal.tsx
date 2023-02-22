import Modal from './Modal'
import { HANDMAID, Player } from '../Snapshot';
import Props from './props'
import ListModal from './ListModal'
import CardView from '../CardView'
import './style.scss'

type State = {
  selectedPlayer?: Player;
}

export default class PriestModal extends ListModal<Props<unknown>, State> implements Modal {
  constructor(props: Props<unknown>) {
    super(props);
    const others = this.getOtherPlayers();
    const selectedPlayer = others.length === 1 ? others[0] : undefined;
    this.state = { selectedPlayer };
  }

  tryAbort() {
    if (!this.state.selectedPlayer) {
      this.props.onAbort();
    }
  }

  getOtherPlayers() {
    const { players } = this.props.snapshot;
    return players
      .filter(player => player !== this.props.me)
      .filter(player => player.played[player.played.length - 1] !== HANDMAID);
  }

  getList(): { prompt: string; list: any; } {
    const others = this.getOtherPlayers();
    if (!others.length) {
      return {
        prompt: 'All other players protected',
        list: <button onClick={ () => this.props.onDone({}) }>Ok</button>
      };
    }
    if (this.state.selectedPlayer) {
      return {
        prompt: `${this.state.selectedPlayer.id}'s card:`,
        list: <div>
          <CardView card={ this.state.selectedPlayer.hand[0] } />
          <button onClick={ () => this.props.onDone({}) }>Ok</button>
        </div>
      };
    }
    return {
      prompt: 'See players card',
      list: others.map(
        player => <button key={ player.id } onClick={ () => this.setState({ selectedPlayer: player })}>
          { player.id.substr(0, 4) }
        </button>
      )
    };
  }
}
