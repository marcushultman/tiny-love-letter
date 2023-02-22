import Modal from './Modal'
import { CardMeta, GUARD, BARON, Card, COUNTESS, HANDMAID, KING, Player, PRIEST, PRINCE, PRINCESS } from '../Snapshot';
import Props from './props'
import ListModal from './ListModal'
import './style.scss'

type State = {
  selectedPlayer?: Player;
}

const CANDIDATES = [PRIEST, BARON, HANDMAID, PRINCE, KING, COUNTESS, PRINCESS];

type GuardMeta = CardMeta<typeof GUARD>;

export default class GuardModal extends ListModal<Props<GuardMeta>, State> implements Modal {
  constructor(props: Props<GuardMeta>) {
    super(props);
    const others = this.getOtherPlayers();
    const selectedPlayer = others.length === 1 ? others[0] : undefined;
    this.state = { selectedPlayer };
  }

  tryAbort() {
    this.props.onAbort();
  }

  getOtherPlayers() {
    const { players } = this.props.snapshot;
    return players
      .filter(player => player !== this.props.me)
      .filter(player => player.played[player.played.length - 1] !== HANDMAID);
  }

  onCardSelected(card: Card<any>) {
    const targetIndex = this.props.snapshot.players.findIndex(player => player.id === this.state.selectedPlayer?.id);
    const cardGuess = card.value;
    this.props.onDone({ targetIndex, cardGuess });
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
        prompt: `Guess ${this.state.selectedPlayer.id}'s a card`,
        list: CANDIDATES.map(
          card => <button key={ card.value } onClick={ () => this.onCardSelected(card) }>{ card.title }</button>
        )
      };
    }
    return {
      prompt: 'Pick a player',
      list: others.map(
        player => <button key={ player.id } onClick={ () => this.setState({ selectedPlayer: player })}>
          { player.id.substr(0, 4) }
        </button>
      )
    };
  }
}
