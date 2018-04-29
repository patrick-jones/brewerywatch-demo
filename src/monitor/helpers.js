import React from 'react';
import {Avatar, Card, CardActions, CardText, CardTitle} from 'react-md';

import fv from '../assets/fv.svg';
import brite from '../assets/brite.svg';

const fvAvatar = (<Avatar src={fv} suffix='white' alt='Fermentation Vessel' className='md-avatar--card' />);
const briteAvatar = (<Avatar src={brite} suffix='white' alt='Brite Tank' className='md-avatar--card' />);

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});


export function vesselAvatar(kind) {
  return kind === 'brite' ? briteAvatar : fvAvatar;
}

export function forUnit(reading, unit) {
  return unit === 'c' ? reading.degc : reading.degf;
}

export const unitSymbols = {
  c: '°C',
  f: '°F',
};


const EMPTY_DATE = '--/-- --:--';

export function formatEpoch(ts) {
  try {
    return dateFormatter.format(new Date(ts * 1000));
  } catch (e) {}
  return EMPTY_DATE;
}


export function domainYMin(dataMin) {
  return Math.round(dataMin - (dataMin % 5));
}

export function domainYMax(dataMax) {
  return Math.round((dataMax + 5) - ((dataMax + 5) % 5));
}

export const domainYauto = [domainYMin, domainYMax];
export const domainXmax = ['dataMin', 'dataMax'];

export function domainYreducer(readings, units) {
  let [min, max] = defaultMinMax(units);

  if (readings.length) {
    min = readings.reduce((prior, reading) => {
      const t = forUnit(reading, units);
      return t < prior ? t : prior;
    }, max);

    max = readings.reduce((prior, reading) => {
      const t = forUnit(reading, units);
      return t > prior ? t : prior;
    }, min);
  }

  return [domainYMin(min), domainYMax(max)];
}


export function defaultMinMax(units) {
  return units === 'f' ? [30, 100] : [0, 35];
}

function* range(start, end, by) {
  let v = start;
  while (v <= end) {
    yield v;
    v += by;
  }
}


export function ticksGenerator(min, max, by=5) {
  return Array.from(range(min, max, by));
}


// export function labelsX(readings, domainX) {
//   let labelLeft = EMPTY_DATE, labelRight = EMPTY_DATE;
//
//   if (readings.length) {
//     let leftIdx = 0, rightIdx = readings.length -1;
//     if (domainX[0] !== 'dataMin') {
//       leftIdx = readings.findIndex(r => r.ts === domainX[0]).ts;
//     }
//     if (domainX[1] !== 'dataMax') {
//       rightIdx = readings.slice(leftIdx).findIndex(r => r.ts === domainX[1]).ts;
//     }
//     labelLeft = formatEpoch(readings[leftIdx].ts);
//     labelRight = formatEpoch(readings[rightIdx].ts);
//   }
//
//   return {labelLeft, labelRight};
// }


export function mouseMode(activeTool) {
  switch (activeTool) {
    case 'archive':
      return 'select';
    case 'annotate':
      return 'click';
    default:
      return 'none';
  }
}
