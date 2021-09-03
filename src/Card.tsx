import { Component } from 'react';
import './Card.scss'

export default class Card extends Component<{ onSelect?: () => void }, {}> {
  render() {
    return (
      <div className="Card">
        Card
      </div>
    );
  }
}
