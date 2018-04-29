import React, { PureComponent } from 'react';
import {Link} from 'react-router-dom';
import {Button, Cell, Grid} from 'react-md';

import {Firestore} from '../fb';
import {ErrorBoundary, MasterDetail} from '../common';


import ArchiveList from './ArchiveList';
import ArchivedReadings from './ArchivedReadings';


class Archive extends PureComponent {

  master = ({archives, errors, references, loading, showDetail, dispatch}) => {
    return (
      <ErrorBoundary>
        <ArchiveList
          loading={!!loading.archives}
          showDetail={showDetail}
          archives={archives}
          errors={errors}
          references={references}
          dispatch={dispatch}
        />
      </ErrorBoundary>
    );
  };

  detail = ({archives, errors, references}) => {
    const {profile, roles, tenant, uid, user} = this.props;
    return (
      <ErrorBoundary>
        <Button icon component={Link} to='/archive'>close</Button>
        <div className='container pad-x'>
          <ArchivedReadings
            uid={uid}
            user={user}
            tenant={tenant}
            roles={roles}
            profile={profile}
            archives={archives}
          />
        </div>
      </ErrorBoundary>
    );
  };

  render() {
    const {uid, tenant} = this.props;
    const showDetail = !!uid;

    const wrapperClass = showDetail ? '' : 'container';
    const masterClass = showDetail ? '' : 'md-grid';

    return (
      <Firestore
        id='archive'
        subs={{
          archives: {
            path: `breweries/${tenant}/archives`,
            where: {
              field: 'deleteFlag',
              comp: '==',
              value: 0,
            },
            orderBy: {
              field: 'created',
              direction: 'desc',
            },
          },
          sensors: {
            path: `breweries/${tenant}/sensors`,
          },
        }}
      >
        {({data, errors, loading, references, dispatch}) => {
          return (
            <MasterDetail
              showDetail={showDetail}
              wrapperClass={wrapperClass}
              masterClass={masterClass}

              master={() => this.master({archives: data.archives, errors, references, loading, showDetail, dispatch})}
              detail={() => this.detail({archives: data.archives, errors, references})}
            />
          );
        }}
      </Firestore>
    );
  }
}

export default Archive;
