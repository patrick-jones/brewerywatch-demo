import React from 'react';

import './Gauge.scss';


//global unique key for every gauge (needed for SVG groups to stay separated)
let uniqueId = 0;

const WIDTH = 400;
const HEIGHT = 280;

/**
 * Derived from https://github.com/Reggino/react-svg-gauge
 *
 * see also https://jsfiddle.net/qgjyrhnq/
 */
export default class Gauge extends React.Component {
  static defaultProps = {
    min: 30,
    max: 100,
    color: '#fe0400',
    symbol: '',
    backgroundColor: "#edebeb",
    topLabelStyle: {textAnchor: "middle", fill:"#999999", stroke: "none", fontStyle: "normal",fontVariant: "normal", fontWeight: 'bold', fontStretch: 'normal', lineHeight: 'normal', fillOpacity: 1},
    valueLabelStyle: {textAnchor: "middle", fill:"#010101", stroke: "none", fontStyle: "normal", fontVariant: "normal", fontWeight: 'bold', fontStretch: 'normal', lineHeight: 'normal', fillOpacity: 1},
    minMaxLabelStyle: {textAnchor: "middle", fill:"#999999", stroke: "none", fontStyle: "normal",fontVariant: "normal", fontWeight: 'normal', fontStretch: 'normal', fontSize: 20, lineHeight: 'normal', fillOpacity: 1}
  };

  _getPathValues = (value) => {
    if (value < this.props.min) value = this.props.min;
    if (value > this.props.max) value = this.props.max;

    let dx = 0;
    let dy = 0;

    let alpha = (1 - (value - this.props.min) / (this.props.max - this.props.min)) * Math.PI;
    let Ro = WIDTH / 2 - WIDTH / 10;
    let Ri = Ro - WIDTH / 6.666666666666667;

    let Cx = WIDTH / 2 + dx;
    let Cy = HEIGHT / 1.25 + dy;

    let Xo = WIDTH / 2 + dx + Ro * Math.cos(alpha);
    let Yo = HEIGHT - (HEIGHT - Cy) - Ro * Math.sin(alpha);
    let Xi = WIDTH / 2 + dx + Ri * Math.cos(alpha);
    let Yi = HEIGHT - (HEIGHT - Cy) - Ri * Math.sin(alpha);

    return { alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi };
  };

  _getPath = (value) => {
    let { Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi } = this._getPathValues(value);

    let path = "M" + (Cx - Ri) + "," + Cy + " ";
    path += "L" + (Cx - Ro) + "," + Cy + " ";
    path += "A" + Ro + "," + Ro + " 0 0 1 " + Xo + "," + Yo + " ";
    path += "L" + Xi + "," + Yi + " ";
    path += "A" + Ri + "," + Ri + " 0 0 0 " + (Cx - Ri) + "," + Cy + " ";
    path += "Z ";

    return path;
  };

  uniqueFilterId;

  render() {
    let { Cx, Ro, Ri, Xo, Cy, Xi } = this._getPathValues(this.props.max);
    if(!this.uniqueFilterId) this.uniqueFilterId = "filter_"+ uniqueId++;

    const {value} = this.props;
    const hasValue = !!value || value === 0;
    const label = hasValue ? value : '--.-';

    return (
      <svg viewBox="0 20 400 280" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={this.uniqueFilterId}>
            <feOffset dx="0" dy="3" />
            <feGaussianBlur result="offset-blur" stdDeviation="5" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.2" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>
        <path fill={this.props.backgroundColor} stroke="none" d={this._getPath(this.props.max)} filter={"url(#" + this.uniqueFilterId + ")"} />
        {hasValue && <path fill={this.props.color} stroke="none" d={this._getPath(this.props.value)} filter={"url(#" + this.uniqueFilterId + ")"} />}
        <text x={WIDTH / 2} y={Cy + 25} textAnchor="middle" className='react-svg-gauge-value'>
          {label}{this.props.symbol}
        </text>
        <text x={((Cx - Ro) + (Cx - Ri)) / 2} y={Cy + 25} textAnchor="middle" className='react-svg-gauge-min-max'>
          {this.props.min}
        </text>
        <text x={(Xo + Xi)/2} y={Cy + 25} textAnchor="middle" className='react-svg-gauge-min-max'>
          {this.props.max}
        </text>
      </svg>
    );
  }
}
