import React, { FormEvent } from 'react';
import { createBrowserHistory } from 'history';

import { writeState } from './firebase';
import { State } from './schema';
import './Start.scss';

class Start extends React.Component {

  constructor(props: any) {
    super(props);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    
  }



  handleJoin(e: any) {
    e.preventDefault();
    
    const token = e.target[0].value;
    let playerId = this.getPlayerId();
    createBrowserHistory().push(token);
  }

  handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    const token = this.uuidv4();

    let playerId = this.getPlayerId();

    let state: State = {
      seed: 1,
      actions: [],
      players: [playerId]
    };

    await writeState(token, state);

    createBrowserHistory().push(token);
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

export default Start;
