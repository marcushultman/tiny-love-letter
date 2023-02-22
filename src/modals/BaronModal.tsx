import Modal from './Modal'
import { CardMeta, BARON, HANDMAID, Player } from '../Snapshot';
import Props from './props'
import ListModal from './ListModal'
import CardView from '../CardView'
import './style.scss'

type State = {
  selectedPlayer?: Player;
}

type BaronMeta = CardMeta<typeof BARON>;

export default class BaronModal extends ListModal<Props<BaronMeta>, State> implements Modal {
  constructor(props: Props<BaronMeta>) {
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

  onCardSelected() {
    const targetIndex = this.props.snapshot.players.findIndex(player => player.id === this.state.selectedPlayer?.id);
    this.props.onDone({ targetIndex });
  }

  getList(): { prompt: string; list: any; } {
    const others = this.getOtherPlayers();
    if (!others.length) {
      return {
        prompt: 'All other players protected',
        list: <button onClick={ () => this.onCardSelected() }>Ok</button>
      };
    }
    if (this.state.selectedPlayer) {
      const diff = this.props.me.hand[0].value - this.state.selectedPlayer.hand[0].value;
      const s = diff === 0 ? 'Tie, Continue' : (diff < 0 ? 'You lost' : `${this.state.selectedPlayer.id.substr(0, 4)} lost`);
      return {
        prompt: `${this.state.selectedPlayer.id}'s card:`,
        list: <div>
          <div className="cards">
            <div>
              <span>{ this.props.me.id.substr(0, 4) }</span>
              <CardView card={ this.props.me.hand[0] } />
            </div>
            <span>vs.</span>
            <div>
              <span>{ this.state.selectedPlayer.id.substr(0, 4) }</span>
              <CardView card={ this.state.selectedPlayer.hand[0] } />
            </div>
          </div>
          <button onClick={ () => this.onCardSelected() }>{ s }</button>
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
