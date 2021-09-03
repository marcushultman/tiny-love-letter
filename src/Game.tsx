import { Component } from 'react';
import './Game.scss';
import { State } from './schema'
import Card from './Card'
import { readState } from './firebase';

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

    const state = await readState(this.props.token);
    this.setState({ loading: false, state });

    console.log({ state });
  }

  render() {

    let myHand;
    console.log(this.state);
    if (!this.state.loading && this.state.state.actions && this.state.state.actions.length % this.state.state.players.indexOf(this.props.me) === 0) {
      myHand =
      <div className="Game-myhand">
        <Card />
        <Card />
      </div>;
    } else if(!this.state.loading) {
      myHand =
      <div className="Game-myhand">
        <Card />
      </div>;
    }

    return (
      <div className= "Game" >
        <div className="Game-vask"><Card /> <Card /> <Card /> <Card /></div>
        <div className="Game-played">Waiting...</div>
        { myHand }
      </div>
    );
  }
}
