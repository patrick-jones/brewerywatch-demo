import React, {PureComponent} from 'react';
import PT from 'prop-types';
import {kea} from 'kea';

import {
  Area,
  AreaChart,
  Brush,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import {TemperatureReading} from '../fb/dataShapes';
import {ErrorBoundary, RenderProp} from '../common';

import AnnotationLabel from './AnnotateLabel';
import ChartTooltip from './ChartTooltip';
import {domainYauto, domainYreducer, formatEpoch, ticksGenerator} from './helpers';
import {withKey} from '../util';


import './TimelineChart.scss';


const CHART_MARGIN = { top: 0, right: 0, bottom: 0, left: 0 };


const TimelineChartState = kea({
  key: (props) => props.id,
  path: (key) => ['scenes', 'readings', 'chart', key],

  actions: () => ({
    selectStart: start => ({start}),
    selectMove: end => ({end}),
    selectEnd: () => true,
  }),

  reducers: ({actions, key}) => {
    const keyed = withKey(key);
    return ({
      selection: [[], PT.arrayOf(PT.number), {
        [actions.selectStart]: keyed((state, {start}) => [start, start]),
        [actions.selectMove]: keyed((state, {end}) => [state[0], end]),
        [actions.selectEnd]: keyed(() => []),
      }],
    });
  },

  selectors: ({selectors}) => ({
    yAxisSettings: [
      () => [(_, props) => (props.readings || []), (_, props) => props.units],
      (readings, units) => {
        const [min, max] = domainYreducer(readings, units);
        const ticksY = ticksGenerator(min, max);
        return {
          domainY: [min, max],
          ticksY
        }
      },
      PT.shape({domainY: PT.arrayOf(PT.number), ticksY: PT.arrayOf(PT.number)}),
    ],
  }),

})(RenderProp);


export class TimelineChartComponent extends PureComponent {

  static propTypes = {
    units: PT.oneOf(['c', 'f']),
    readings: PT.arrayOf(PT.shape(TemperatureReading)),
    mouseMode: PT.oneOf(['none', 'select', 'click']),
    onPointSelect: PT.func,
    onRegionSelect: PT.func,
    onAnnotationClick: PT.func,
    actions: PT.shape({
      selectStart: PT.func,
      selectMove: PT.func,
      selectEnd: PT.func,
    }),
    selection: PT.arrayOf(PT.number),
    yAxisSettings: PT.shape({domainY: PT.arrayOf(PT.number), ticksY: PT.arrayOf(PT.number)}),
  };

  static defaultProps = {
    units: 'f',
    readings: [],
    selection: [],
    mouseMode: 'none',
    domainY: domainYauto,
  };

  handleMouseClick = e => {
    const {onPointSelect} = this.props;
    if (e && e.activePayload && e.activePayload.length) {
      onPointSelect(e.activePayload[0].payload);
    }
  };

  handleMouseDown = e => {
    const {actions: {selectStart}} = this.props;
    if (e && e.activeLabel) {
      selectStart(e.activeLabel);
    }
  };

  handleMouseMove = e => {
    const {actions: {selectMove}} = this.props;
    if (e && e.activeLabel) {
      selectMove(e.activeLabel);
    }
  };

  handleMouseUp = () => {
    let {selection, actions: {selectEnd}, onRegionSelect} = this.props;
    let [start, end] = selection;

    if (start > end) {
      [end, start] = [start, end];
    }

    if (start !== end) {
      onRegionSelect(start, end);
    } else {
      onRegionSelect();
    }
    selectEnd();
  };

  render() {

    const {readings, annotations, units, selection, yAxisSettings: {domainY, ticksY},
      mouseMode, onAnnotationClick} = this.props;

    const selectMode = mouseMode === 'select';
    const clickMode = mouseMode === 'click';
    const isSelecting = selection.length && selectMode;
    const degrees = `deg${units}`;
    const symbol = `°${units.toUpperCase()}`;

    const className = isSelecting
      ? `timeline-chart--mousemode-${mouseMode} timeline-chart--selecting`
      : `timeline-chart--mousemode-${mouseMode}`;

    return (
      <ErrorBoundary>
        <ResponsiveContainer width="100%" height={400} className={className}>
          <AreaChart
            data={readings}
            margin={CHART_MARGIN}
            onMouseDown={selectMode ? this.handleMouseDown : null}
            onMouseMove={isSelecting ? this.handleMouseMove : null}
            onMouseUp={isSelecting ? this.handleMouseUp : null}
            onClick={clickMode ? this.handleMouseClick : null}
          >
            <defs>
              <linearGradient id="colorTmp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4B6D7B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4B6D7B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis
              type="number"
              allowDataOverflow={true}
              dataKey='epoch'
              domain={['dataMin', 'dataMax']}
              // ticks={ticks}
              tickFormatter={formatEpoch}
              // tickMargin={12}
            >
            </XAxis>
            <YAxis
              yAxisId='y-left'
              allowDataOverflow={true}
              type="number"
              dataKey={degrees}
              domain={domainY}
              interval='preserveStartEnd'
              allowDecimals={false}
              ticks={ticksY}
              tickFormatter={value => `${value}${symbol}`}
            />
            <YAxis
              yAxisId='y-right'
              allowDataOverflow={true}
              type="number"
              dataKey={degrees}
              domain={domainY}
              interval='preserveStartEnd'
              allowDecimals={false}
              orientation='right'
              ticks={ticksY}
              tickFormatter={value => `${value}${symbol}`}
            />
            <Tooltip content={ChartTooltip} symbol={symbol} />
            <Area
              yAxisId='y-left'
              type="monotone"
              dataKey={degrees}
              stroke="#4B6D7B"
              fillOpacity={1}
              fill="url(#colorTmp)"
            />
            {annotations.map(point => (
              <ReferenceLine
                key={point.uid}
                x={point.epoch}
                stroke='#f44336cc'
                isFront={true}
                label={<AnnotationLabel point={point} onClick={onAnnotationClick} />}
              />
            ))}
            {
              isSelecting &&
              <ReferenceArea yAxisId='y-left' x1={selection[0]} x2={selection[1]} strokeOpacity={0.3} />
            }
            <Brush
              dataKey='ts'
              tickFormatter={() => ''}
              gap={Math.max(1, Math.round(readings.length / 20))}
              // onChange={({startIndex, endIndex}) => console.log(startIndex, endIndex)}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ErrorBoundary>
    );
  }
}


export default function ManagedTimelineChart(props) {
  return (
    <TimelineChartState {...props}>
      {(managed) => {
        const {id: _, ...rest} = props;
        return (
          <TimelineChartComponent {...managed} {...rest} />
        );
      }}
    </TimelineChartState>
  );
};


/*
          <CartesianGrid strokeDasharray="3 3" />
 */