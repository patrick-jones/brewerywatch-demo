import React from 'react';
import {Button, DialogContainer, TextField, Toolbar} from 'react-md';

import {Firestore} from '../fb';
import {ErrorBoundary, WholePageBusy} from '../common';
import DetailComponent from './DetailComponent';
import DetailManager from './DetailManager';


const ArchivedReadings = props => {
  const {uid, tenant, user, profile, archives=[], units='f'} = props;

  const archive = archives.find(s => s.uid === uid);

  if (!archive || !uid) {
    return (<WholePageBusy />);
  }

  const datumPath = `breweries/${tenant}/archives/${uid}/readings`;

  return (
    <Firestore
      id={`ArchivedReadings-${uid}`}
      subs={{
        readings: {
          path: datumPath,
          orderBy: {
            field: 'ts',
            direction: 'asc',
          },
          // dataCallback: data => ({...data, ts: data.ts.seconds ? data.ts.seconds : data.ts}),
        },
        sensor: `breweries/${tenant}/sensors/${archive.src}`,
      }}
    >
      {({data, errors}) => {
        const {sensor={}} = data;
        const title = `${archive.label} - ${sensor.displayName || archive.src}`;
        return (
          <ErrorBoundary>
            <DetailManager
              id={uid}
              archive={archive}
              user={user}
              tenant={tenant}
              datumPath={datumPath}
              {...data}
            >
              <DetailComponent
                uid={uid}
                user={user}
                profile={profile}
                errors={errors}
                units={units}
                live={false}
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

export default ArchivedReadings;
