import React from 'react';

import {formatEpoch} from './helpers';

const ChartTooltip = ({active, payload, label, symbol}) => {
  if (!active) return null;
  let dt = '--/-- --:--';
  let val = '-.--';
  try {
    dt = formatEpoch(label);
    val = payload[0].value;
  } catch (e) {}
  return (
    <div className="custom-tooltip">
      <p className="label">{`${dt} : ${val}${symbol}`}</p>
    </div>
  );
};

export default ChartTooltip;