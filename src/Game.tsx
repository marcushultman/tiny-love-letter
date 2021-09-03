import { Component } from 'react';
import './Game.scss';
import { State } from './schema'
import { readState, writeState } from './firebase';

import Card from './Card'
import EmptyCard from './EmptyCard'
import MultiCard from './MultiCard'

interface GameProps {
  me: string;
  token: string;
}

interface GameState {
  loading: boolean;
  state: State;
}

function makeDeck(seed: number) {
  return [0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 7];
}

function simulateActions(state: State) {
  const numPlayers = state.players.length;
  const deck = makeDeck(state.seed);
  const vask = deck.shift()!;
  const extraVask = state.players.length === 2 ? [deck.shift()!, deck.shift()!, deck.shift()!] : [];
  const snapshot = {
    winner: null as number | null,
    vask,
    extraVask,
    players: state.players.map(id => ({ id, hand: [deck.shift()!], played: [] as number[] })),
    turn: 0,
  };
  state.actions.forEach(action => {
    if (!deck.length) {
      return;
    }
    const player = snapshot.players[snapshot.turn % numPlayers];
    player.hand.push(deck.shift()!);
    const [card] = player.hand.splice(action.index, 1);

    // if (card === 0 && action.meta.card === snapshot.players[action.meta.target].hand[0]) {
    //   snapshot.winner = snapshot.turn;
    // }

    player.played.push(card);
    ++snapshot.turn;
  });
  if (deck.length) {
    snapshot.players[snapshot.turn % numPlayers].hand.push(deck.shift()!);
  }
  return Object.assign(snapshot, { remaining: deck });
}

export default class Game extends Component<GameProps, GameState> {
  poll?: NodeJS.Timer;

  constructor(props: GameProps) {
    super(props);
    this.state = {
      loading: true,
      state: {
        seed: 0,
        players: [],
        actions: [],
      },
    };
  }

  componentDidMount() {
    const detectChange = this.detectChange.bind(this);
    this.poll = setInterval(detectChange, 1000);
  }

  componentWillUnmount() {
    this.poll && clearInterval(this.poll);
  }

  async detectChange() {
    const state = Object.assign({ actions: [] }, await readState(this.props.token));
    this.setState({ loading: false, state });
  }

  async playCard(index: number) {
    const { token } = this.props;
    const state = Object.assign({ actions: [] }, await readState(token));

    const { players } = simulateActions(state);
    const me = players.find(player => player.id === this.props.me)!;
    const card = me.hand[index];

    if (card === 0) {
      // guard
    } else if (card === 1) {
      // priest
    } else if (card === 2) {
      // baron, nop
    } else if (card === 3) {
      // handmaid, nop
    } else if (card === 4) {
      // prince
    } else if (card === 5) {
      // king
    } else if (card === 5) {
      // countess
    } else if (card === 5) {
      // princess
    }

    state.actions.push({ index, meta: '🎣' });
    this.setState({ state });
    await writeState(token, state);
  }

  renderPlayed(cards: number[]) {
    return cards.length ? <MultiCard cards={ cards } /> : <EmptyCard />
  }

  renderHand(me: { hand: number[] }) {
    if (me.hand.length === 2) {
      return <div>
        <h3>Your turn, play a card:</h3>
        <div className="Game-myhand">
          <Card value={ me.hand[0] } onSelect={ () => this.playCard(0) } />
          <Card value={ me.hand[1] } onSelect={ () => this.playCard(1) } />
        </div>
      </div>;
    }
    return <div>
      <h3>Waiting for other player...</h3>
      <div className="Game-myhand">
        <Card value={ me.hand[0] } onSelect={ () => this.playCard(0) } />
      </div>
    </div>;
  }

  render() {
    if (this.state.loading) {
      return (<div className= "Game" >Loading...</div>);
    } else if (this.state.state.players.length < 2) {
      return (<div className= "Game" >Waiting for more players...</div>);
    }

    const snapshot = simulateActions(this.state.state);
    const { players } = snapshot;
    const me = players.find(player => player.id === this.props.me)!;

    return (
      <div className= "Game" >
        <div>#Players: { players.length }</div>
        <button onClick={ () => writeState(this.props.token, Object.assign(this.state.state, { actions: [] })) }>Reset</button>
        <div>{ JSON.stringify(this.state.state) }</div>
        <div>{ JSON.stringify(snapshot) }</div>
        <div className="Game-vask">
          <Card value={ snapshot.vask } hidden={ true } />
          { snapshot.extraVask.map((vask, i) => <Card key={ i } value={ vask }/>) }
        </div>
        <div className="Game-played">{
          players.map((player, i) => (
            <div key={ i }>
              <p>{ player.id === this.props.me ? <b>{ player.id.slice(0, 4) }</b> : player.id.slice(0, 4) }</p>
              { this.renderPlayed(player.played) }
            </div>
          ))
        }</div>
        { this.renderHand(me) }
      </div>
    );
  }
}
