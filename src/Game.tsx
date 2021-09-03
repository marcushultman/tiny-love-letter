import { Component } from 'react';
import './Game.scss';
import { State } from './schema'
import { readState } from './firebase';

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
    console.log('start');
  }

  componentWillUnmount() {
    this.poll && clearInterval(this.poll);
  }

  async detectChange() {

    // mock
    if (this.state.loading) {
      setTimeout(() => {
        const state = {
          seed: 42,
          players: ['abc', 'def'],
          actions: [
            { index: 0, meta: {} },
            { index: 1, meta: {} },
          ],
        }
        this.setState({ loading: false, state });
      }, 500);
    }

    // const state = await readState(this.props.token);
    // this.setState({ loading: false, state });
  }

  playedCards(i: number) {
    // const actions = this.state.state.actions.slice(i).filter((_, i) => i % 2 === 0);

    // return (<div>{ JSON.stringify({ a: this.state.state.actions, b: actions}, null, 2) }</div>);

    // <MultiCard cards={ this.state.state.actions.map(() => 0) } />
    return <EmptyCard />
  }

  render() {
    if (this.state.loading) {
      return (<div className= "Game" >Loading...</div>);
    }

    const { actions, players } = this.state.state;

    let myHand;
    if (actions.length % players.indexOf(this.props.me) === 0) {
      myHand =
      <div>
        <h3>
          <b>Your turn, play a card:</b>
        </h3>
        <div className="Game-myhand">
          <Card onSelect={ () => {} } />
          <Card onSelect={ () => {} } />
        </div>
      </div>;
    } else if(!this.state.loading) {
      myHand =
      <div className="Game-myhand">
        <Card />
      </div>;
    }

    return (
      <div className= "Game" >
        <div>#Players: { players.length }</div>
        <div className="Game-vask"><Card /> <Card /> <Card /> <Card /></div>
        <div className="Game-played">{
          players.map((player, i) => (
            <div>
              <p>{ player === this.props.me ? <b>{ player }</b> : player }</p>
              { this.playedCards(i) }
            </div>
          ))
        }</div>
        { myHand }
      </div>
    );
  }
}
