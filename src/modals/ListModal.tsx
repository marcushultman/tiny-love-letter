import { Component } from 'react';
import './style.scss'

export default abstract class ListModal<P, S> extends Component<P, S> {
  abstract getList(): { prompt: string, list: any };

  render() {
    const { prompt, list } = this.getList();
    return (
      <div className="Modal" onClick={ e => e.stopPropagation() }>
        <p>{ prompt }</p>
        <div className="list">{ list }</div>
      </div>
    );
  }
}
