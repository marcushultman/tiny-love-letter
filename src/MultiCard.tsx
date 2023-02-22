import { CSSProperties , Component } from 'react';
import './MultiCard.scss'
import CardView from './CardView'
import { Card } from './Snapshot';

interface MultiCardProps {
  cards: Card<any>[]
}

export default class MultiCard extends Component<MultiCardProps, {}> {
  constructor(props: MultiCardProps) {
    super(props);
    this.state = { cards: [1, 2, 3] };
  }

  cardStyle(i: number): CSSProperties  {
    return {
      position: 'absolute',
      top: `${i * 10}px`,
      left: `${i * 10}px`,
    };
  }

  render() {
    return (        
      <div className="MultiCard">
        { this.props.cards.map((card, i) => (
          <div key={ i } style={this.cardStyle(i)}><CardView card={ card } /></div>
        ))}
      </div>
    );
  }
}
