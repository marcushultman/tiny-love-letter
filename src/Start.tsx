import React, { FormEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom'   

import { writeState, readState } from './firebase';
import { GameState } from './schema';
import './Start.scss';

class Start extends React.Component<RouteComponentProps> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    
  }



  async handleJoin(e: any) {
    e.preventDefault();
    
    const token = e.target[0].value;
    let playerId = this.getPlayerId();

    const state = await readState(e.target[0].value);
    state.players.push(playerId);
    await writeState(token, state);

    this.props.history.push(token);
  }

  handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    const token = this.uuidv4();

    let playerId = this.getPlayerId();

    let state: GameState = {
      seed: 42,
      actions: [],
      players: [playerId]
    };

    await writeState(token, state);

    this.props.history.push(token);
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getPlayerId() {
    let playerId = localStorage.getItem('playerId');
    if(!playerId) {
      playerId = this.uuidv4();
      localStorage.setItem('playerId', playerId);
    }

    return playerId;
  }


  render() {
    return (
      <div className="Start">
        <header className="Start-header">
          <h3>Join Session</h3>
          <form className="join-form" onSubmit={this.handleJoin}>
            <label htmlFor="join">Join Session</label>
            <input id="join" />
            <input type="submit" value="Join" />
          </form>
          <h3>Create Session</h3>
          <button onClick={this.handleCreate}>Create Session</button>
        </header>
      </div>
    );
  }
}

export default withRouter(Start);
