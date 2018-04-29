import React from 'react';
import {Button, DialogContainer, TextField, Toolbar} from 'react-md';

import {Firestore} from '../fb';

import {ErrorBoundary, WholePageBusy} from '../common';
import DetailComponent from './DetailComponent';
import DetailManager from './DetailManager';


const LiveReadings = props => {
  const {uid, tenant, user, profile, sensors=[], units} = props;

  const sensor = sensors.find(s => s.uid === uid);

  if (!sensor || !uid) {
    return (<WholePageBusy />);
  }

  const datumPath = `breweries/${tenant}/readings`;

  return (
    <Firestore
      id={`LiveReadings-${uid}`}
      subs={{
        readings: {
          path: datumPath,
          where: {
            field: 'src',
            comp: '==',
            value: uid,
          },
          where: {
            field: 'series',
            comp: '==',
            value: sensor.series,
          },
          orderBy: {
            field: 'ts',
            direction: 'desc',
          },
          dataCallback: data => ({...data, epoch: data.ts.seconds}),
          collectionCallback: docs => docs.reverse(),
        },
      }}
    >
      {({data, errors}) => {
        const title = sensor.displayName || sensor.uid;

        return (
          <ErrorBoundary>
            <DetailManager
              id={uid}
              sensor={sensor} {...data}
              user={user}
              tenant={tenant}
              datumPath={datumPath}
              {...data}
            >
              <DetailComponent
                uid={uid}
                user={user}
                profile={profile}
                sensor={sensor}
                errors={errors}
                units={units}
                live={true}
                title={title}
                {...data}
              />
            </DetailManager>
          </ErrorBoundary>
        );
      }}
    </Firestore>
  );
};

export default LiveReadings;
