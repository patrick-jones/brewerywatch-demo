import React from 'react';

import {Firestore} from '../fb';


const SensorSubscriber = ({tenant, sensor, children}) => {
  return (
    <Firestore
      key={sensor.uid}
      id={`VesselSummary-${sensor.uid}`}
      subs={{
        readings: {
          path: `breweries/${tenant}/readings`,
          where: [{
            field: 'src',
            comp: '==',
            value: sensor.uid,
          },
          {
            field: 'series',
            comp: '==',
            value: sensor.series,
          }],
          orderBy: {
            field: 'ts',
            direction: 'desc',
          },
          limit: 300,
          dataCallback: data => ({...data, epoch: data.ts.seconds}),
        },
      }}
    >
      {children}
    </Firestore>
  );
};

export default SensorSubscriber;
