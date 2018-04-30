import React from 'react';
import PT from 'prop-types';

import './AnnotationLabel.scss';
import {TemperatureReading} from '../fb/dataShapes';


export default class AnnotationLabel extends React.Component {

  static propTypes = {
    point: PT.shape(TemperatureReading).isRequired,
    onClick: PT.func,
    fill: PT.string,
  };

  static defaultProps = {
    fill: '#f44336',
    text: '',
  };

  handleClick = e => {
    if (e) e.preventDefault();
    const {onClick, point} = this.props;
    if (onClick) onClick(point);
  };

  renderSymbol(point, fill) {
    if (point.kind === 'annotation') {
      return (
        <g fill={fill}>
          <path d="M0 0h24v24H0z" fill="none"/>
          <rect x="5" y="4" width="14" height="16" fill='#ffffff' />
          <path d="M17 10H7v2h10v-2zm2-7h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-5-5H7v2h7v-2z"/>
        </g>
      );
    }

    return (
      <g fill={fill}>
        <circle cx="12" cy="12" r="12" fill="#ffffff"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </g>
    );
  }

  render() {
    const {point, fill, viewBox} = this.props;
    const {height, width} = viewBox;
    const x = viewBox.x + (width / 2) - 12;
    const y = viewBox.y + (height / 2);

    return (
      <svg
        x={x} y={y}
        height="24"
        width="24"
        viewBox="0 0 24 24"
        className="recharts-label annotation-label"
        onClick={this.handleClick}
      >
        <title>{point.annotation}</title>
        <desc>Click for more</desc>
        {this.renderSymbol(point, fill)}
      </svg>
    );
  }
}