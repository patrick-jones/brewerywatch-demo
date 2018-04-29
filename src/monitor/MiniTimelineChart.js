import React, { PureComponent } from 'react';
import PT from 'prop-types';

import {AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

import {TemperatureReading} from '../fb/dataShapes';

import ChartTooltip from './ChartTooltip';
import {domainXmax, domainYauto} from './helpers';


class MiniTimelineChart extends PureComponent {

  static propTypes = {
    readings: PT.arrayOf(PT.shape(TemperatureReading)),
  };

  static defaultProps = {
    readings: [],
    units: 'f',
  };

  render() {
    const {readings, units} = this.props;
    const degrees = `deg${units}`;
    const symbol = `°${units.toUpperCase()}`;
    return (
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={readings} margin={{ top: 0, right: 0, bottom: 0, left: 0}}>
          <defs>
            <linearGradient id="colorTmp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4B6D7B" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#4B6D7B" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis type="number" dataKey='epoch' domain={domainXmax} tick={false} />
          <YAxis type="number" dataKey={degrees} domain={domainYauto} hide />
          <Tooltip content={ChartTooltip} symbol={symbol} />
          <Area type="monotone" dataKey={degrees} stroke="#4B6D7B" fillOpacity={1} fill="url(#colorTmp)" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}

export default MiniTimelineChart;
