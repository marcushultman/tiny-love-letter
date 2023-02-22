import React, { Component } from 'react';
import './Game.scss';
import { GameState } from './schema'
import { readState, writeState } from './firebase';
import Snapshot, {
  Card,
  BARON,
  COUNTESS,
  GUARD,
  HANDMAID,
  KING,
  PRIEST,
  PRINCE,
  PRINCESS,
  Player,
} from './Snapshot'

import CardView from './CardView'
import EmptyCard from './EmptyCard'
import MultiCard from './MultiCard'

import Modal from './modals/Modal'
import GuardModal from './modals/GuardModal'
import PriestModal from './modals/PriestModal'
import BaronModal from './modals/BaronModal'
import PrinceModal from './modals/PrinceModal'
import KingModal from './modals/KingModal'
interface GameProps {
  me: string;
  token: string;
}

interface State {
  loading: boolean;
  state: GameState;
  selectedCardIndex: number | null;
}

function makeDeck(seed: number): Card<any>[] {
  // return [GUARD, GUARD, GUARD, GUARD, GUARD, PRIEST, PRIEST, BARON, BARON, HANDMAID, HANDMAID, PRINCE, PRINCE, KING, COUNTESS, PRINCESS];
  return [GUARD, GUARD, GUARD, KING, COUNTESS, PRINCESS, GUARD, GUARD, PRIEST, PRIEST, BARON, BARON, HANDMAID, HANDMAID, PRINCE, PRINCE];
}

function simulateActions(state: GameState): Snapshot {
  const numPlayers = state.players.length;
  const deck = makeDeck(state.seed);
  const vask = deck.shift()!;
  const extraVask = state.players.length === 2 ? [deck.shift()!, deck.shift()!, deck.shift()!] : [];
  const snapshot: Snapshot = {
    turn: 0,  // who starts?
    vask,
    extraVask,
    players: state.players.map(id => ({
      id,
      lost: false,
      hand: [deck.shift()!],
      played: []
    })),
    deck,
  };
  state.actions.forEach(action => {
    const drawnCard = deck.shift();
    if (!drawnCard) {
      return;
    }
    const player = snapshot.players[snapshot.turn % numPlayers];
    player.hand.push(drawnCard);
    const [playedCard] = player.hand.splice(action.index, 1);

    playedCard.applyAction(action.meta, snapshot);

    player.played.push(playedCard);
    ++snapshot.turn;
  });
  if (deck.length) {
    snapshot.players[snapshot.turn % numPlayers].hand.push(deck.shift()!);
  }
  return snapshot;
}

export default class Game extends Component<GameProps, State> {
  poll?: NodeJS.Timer;
  modalRef: React.RefObject<Modal>;

  constructor(props: GameProps) {
    super(props);
    this.state = {
      loading: true,
      state: {
        seed: 0,
        players: [],
        actions: [],
      },
      selectedCardIndex: null,
    };
    this.modalRef = React.createRef();
  }

  componentDidMount() {
    const detectChange = this.detectChange.bind(this);
    this.poll = setInterval(detectChange, 1000);
  }

  componentWillUnmount() {
    this.poll && clearInterval(this.poll);
  }

  async getGameState(): Promise<GameState> {
    return Object.assign({ actions: [] }, await readState(this.props.token));
  }

  async detectChange() {
    const state = await this.getGameState();
    this.setState({ loading: false, state });
    console.log(state.actions.length);
  }

  async reset() {
    const { state } = this.state;
    Object.assign(state, { actions: [] });
    this.setState({ state })
    await writeState(this.props.token, state);
  }

  async playCard(cardIndex: number) {
    const { players } = simulateActions(this.state.state);
    const me = players.find(player => player.id === this.props.me)!;
    const card = me.hand[cardIndex];
   
    if (card.hasModal) {
      this.setState({ selectedCardIndex: cardIndex });
    } else {
      const state = await this.getGameState();
      state.actions.push({ index: cardIndex });
      this.setState({ state });
      await writeState(this.props.token, state);
    }
  }

  dismissModal() {
    this.setState({ selectedCardIndex: null });
  }

  async onPlayed(meta: any) {
    const index = this.state.selectedCardIndex!;
    const state = await this.getGameState();
    state.actions.push({ index, meta });
    this.setState({ state, selectedCardIndex: null });
    await writeState(this.props.token, state);
  }

  renderPlayed(cards: Card<any>[]) {
    return cards.length ? <MultiCard cards={ cards } /> : <EmptyCard />
  }

  renderHand(me: { hand: Card<any>[] }) {
    if (me.hand.length === 2) {
      return <div>
        <h3>Your turn, play a card:</h3>
        <div className="Game-myhand">
          <CardView card={ me.hand[0] } onSelect={ () => this.playCard(0) } />
          <CardView card={ me.hand[1] } onSelect={ () => this.playCard(1) } />
        </div>
      </div>;
    }
    return <div>
      <h3>Waiting for other player...</h3>
      <div className="Game-myhand">
        <CardView card={ me.hand[0] } />
      </div>
    </div>;
  }

  renderWinner(players: Player[]) {
    if (players.length > 1) {
      return null;
    }
    return <div className="banner">
      <div>{ players[0].id.substr(0, 4) } won!</div>
      <button onClick={ () => this.reset() }>Play again</button>
    </div>
  }

  render() {
    if (this.state.loading) {
      return (<div className= "Game" >Loading...</div>);
    } else if (this.state.state.players.length < 2) {
      return (<div className= "Game" >Waiting for more players...</div>);
    }

    const { selectedCardIndex } = this.state;
    const snapshot = simulateActions(this.state.state);
    const { players, deck } = snapshot;
    const me = players.find(player => player.id === this.props.me)!;

    const remainingPlayers = players.filter(player => !player.lost)

    const selectedCard = selectedCardIndex !== null && me.hand[selectedCardIndex];
    const onAbort = () => this.dismissModal();
    const onDone = (meta: any) => this.onPlayed(meta);
    const modalProps = { ref: this.modalRef as any, me, snapshot, onAbort, onDone };

    return (
      <div className= "Game" onClick={ () => this.modalRef.current?.tryAbort() }>
        <div>#Players: { players.length }</div>
        <button onClick={ () => this.reset() }>Reset</button>
        <div>{ JSON.stringify(this.state.state) }</div>
        <div>{ JSON.stringify({ ...snapshot, selectedCard }) }</div>
        <div className="Game-vask">
          <CardView card={ snapshot.vask } hidden={ true } />
          { snapshot.extraVask.map((vask, i) => <CardView key={ i } card={ vask }/>) }
        </div>
        <div className="Game-played">
          <MultiCard cards={ deck } />
          { players.map((player, i) => (
            <div key={ i }>
              <p>{ player.id === this.props.me ? <b>{ player.id.slice(0, 4) }</b> : player.id.slice(0, 4) }</p>
              { this.renderPlayed(player.played) }
            </div>
          )) }
        </div>
        { this.renderHand(me) }
        { this.renderWinner(remainingPlayers) }
        { selectedCard === GUARD && <GuardModal { ...modalProps } /> }
        { selectedCard === PRIEST && <PriestModal { ...modalProps } /> }
        { selectedCard === BARON && <BaronModal { ...modalProps } /> }
        { selectedCard === PRINCE && <PrinceModal { ...modalProps } /> }
        { selectedCard === KING && <KingModal { ...modalProps } /> }
      </div>
    );
  }
}
