import React, { Component } from 'react';
import './CardView.scss'
import { Card } from './Snapshot';

interface CardProps {
  card: Card<any>;
  hidden?: boolean;
  onSelect?: () => void;
}

export default class CardView extends Component<CardProps, {}> {
  onClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    this.props.onSelect?.();
  }
  render() {
    return (
      <div className="Card" onClick={ e => this.onClick(e) }>
        {/* { this.props.hidden ? '?' : this.props.value } */}
        { this.props.card.value }
      </div>
    );
  }
}
