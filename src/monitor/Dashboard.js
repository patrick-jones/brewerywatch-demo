import React, { PureComponent, Fragment } from 'react';
import PT from 'prop-types';
import { Link } from 'react-router-dom';
import {Button, Cell, Drawer, Grid} from 'react-md';

import {Firestore} from '../fb';
import {ErrorBoundary, MasterDetail} from '../common';
import SensorCard from './SensorCard';
import {RoutePropsShape} from '../routing';
import SensorList from './SensorList';
import LiveReadings from './LiveReadings';
import SensorSubscriber from './SensorSubscriber';


class Dashboard extends PureComponent {

  static propTypes = {
    router: PT.shape(RoutePropsShape),
  };

  sensorList = (sensors=[]) => {
    const {uid, tenant} = this.props;
    return (
      <SensorList
        sensors={sensors}
        tenant={tenant}
        active={uid}
      />
    );
  };

  sensorCards = (sensors=[]) => {
    const {router: {match}, tenant} = this.props;
    return (
      <ErrorBoundary>
        {sensors.map(sensor => {
          const detailPath = `${match.path}readings/${sensor.uid}`;
          return (
            <Cell
              key={sensor.uid}
              desktopSize={3}
              tabletSize={4}
              phoneSize={2}
            >
              <SensorSubscriber key={sensor.uid} tenant={tenant} sensor={sensor}>
                {({data, errors}) => {
                  return (
                    <SensorCard
                      sensor={sensor}
                      sensors={sensors}
                      readings={data.readings}
                      errors={errors}
                      detailPath={detailPath}
                      tenant={tenant}
                    />
                  );
                }}
              </SensorSubscriber>
            </Cell>
          );
        })}
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
        id='dashboard'
        subs={{
          sensors: {
            path: `breweries/${tenant}/sensors`,
          },
        }}
      >
        {({data, errors, references}) => {
          const {references: _, ...passthru} = this.props;
          return (
            <MasterDetail
              showDetail={showDetail}
              wrapperClass={wrapperClass}
              masterClass={masterClass}

              master={() => {
                return showDetail ? this.sensorList(data.sensors) : this.sensorCards(data.sensors);
              }}
              detail={() => {
                return (
                  <Fragment>
                    <Button icon component={Link} to='/readings'>close</Button>
                    <div className='container pad-x'>
                      <LiveReadings {...data} {...passthru} references={references} />
                    </div>
                  </Fragment>
                );
              }}
            />
          );
        }}
      </Firestore>
    );
  }
}

export default Dashboard;
