import { Component } from 'react';
import './Card.scss'

interface CardProps {
  value: number;
  hidden?: boolean;
  onSelect?: () => void
}

export default class Card extends Component<CardProps, {}> {
  render() {
    return (
      <div className="Card" onClick={ () => this.props.onSelect?.() }>
        {/* { this.props.hidden ? '?' : this.props.value } */}
        { this.props.value }
      </div>
    );
  }
}
