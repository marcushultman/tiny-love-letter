import React, { FormEvent } from 'react';
import { writeUserData, readUserData } from './firebase';
import './Start.scss';

class Start extends React.Component {

  constructor(props: any) {
    super(props);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleJoin(e: FormEvent) {
    e.preventDefault();
    // todo: join
    console.log('join');
  }

  handleCreate = (e: FormEvent) => {
    console.log(e);
    e.preventDefault();

    writeUserData("123", "name!").then(() => {

      readUserData("123").then(response => {
        console.log("response", response);
      })
    });


    // this.setState({ token });
    // console.log('create', token);
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
