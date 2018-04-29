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

  render() {
    const {point, fill, viewBox, onClick} = this.props;
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
        <circle cx="12" cy="12" r="12" fill="#ffffff"/>
        <path fill={fill}
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
    );
  }
}