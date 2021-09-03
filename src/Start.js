import React from 'react';
import './Start.scss';

class Start extends React.Component {

  constructor() {
    super();
    this.handleJoin = this.handleJoin.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleJoin(e) {
    e.preventDefault();
    // todo: join
    console.log('join');
  }

  handleCreate(e) {
    e.preventDefault();
    // todo: create
    console.log('create');
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
