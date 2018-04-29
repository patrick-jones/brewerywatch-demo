import React from 'react';
import {Firestore} from '../fb';


const ArchiveReadingsSubscriber = ({tenant, archive, children}) => {
  return (
    <Firestore
      key={archive.uid}
      id={`ArchiveReadings-${archive.uid}`}
      subs={{
        readings: {
          path: `breweries/${tenant}/archives/${archive.uid}/readings`,
          orderBy: {
            field: 'ts',
            direction: 'asc',
          },
          dataCallback: data => ({...data, ts: data.ts.seconds}),
        },
      }}
    >
      {children}
    </Firestore>
  );
};

export default ArchiveReadingsSubscriber;

