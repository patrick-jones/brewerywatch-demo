import React, { PureComponent } from 'react';
import PT from 'prop-types';
import {call, put} from 'redux-saga/effects';
import {Avatar, Card, CardActions, CardText, CardTitle} from 'react-md';
import { Link } from 'react-router-dom';

import {firebase} from '../fb';
import {Sensor, TemperatureReading} from '../fb/dataShapes';

import {ClickToEdit, managedComponent, SnackbarLogic} from '../common';
import Gauge from './Gauge';
import MiniTimelineChart from './MiniTimelineChart';
import {vesselAvatar, defaultMinMax} from './helpers';

import './SensorCard.scss';


const SensorCardLogic = managedComponent({
  connect: {
    actions: [
      SnackbarLogic, ['addToast']
    ],
  },

  path: () => ['kea', 'monitor', 'SensorCard'],

  actions: () => ({
    changeDisplayName: (uid, displayName) => ({uid, displayName}),
  }),

  takeEvery: ({ actions }) => ({
    [actions.changeDisplayName]: function * (action) {
      const {tenant} = this.props;
      const {uid, displayName} = action.payload;
      try {
        const docRef = firebase.firestore().doc(`breweries/${tenant}/sensors/${uid}`);
        yield call([docRef, docRef.update], {displayName})
      } catch (e) {
        yield put(actions.addToast('Unable to save name'));
      }
    },
  }),

});


class SensorCardComponent extends PureComponent {

  static propTypes = {
    sensor: PT.shape(Sensor),
    detailPath: PT.string,
    tenant: PT.string,
    readings: PT.arrayOf(PT.shape(TemperatureReading)),
    units: PT.oneOf(['c', 'f']),
  };

  static defaultProps = {
    readings: [],
    units: 'f',
    detailPath: '',
    tenant: '',
  };

  handleDisplayNameChanged = displayName => {
    const {sensor: {uid}, actions: {changeDisplayName}} = this.props;
    changeDisplayName(uid, displayName);
  };

  render() {
    const {sensor: {uid, kind, displayName}, detailPath, readings, units} = this.props;
    const title = displayName || uid;

    const subtitle = kind === 'brite' ? 'Brite' : 'Fermenter';
    const avatar = vesselAvatar(kind);

    const latest = readings.length ? readings[0] : {};
    const value = latest[`deg${units}`];
    const symbol = `°${units.toUpperCase()}`;

    const [min, max] = defaultMinMax(units);

    return (
      <Card className={`vessel-summary vessel-summary--${kind}`}>
        <div className="md-card-title vessel-summary__title">
          {avatar}
          <div className='md-card-title--title-block md-card-title--one-line'>
            <ClickToEdit
              id={`${uid}-title`}
              className='vessel-summary-editable-title'
              value={title}
              onSave={this.handleDisplayNameChanged}
            >
              <h2 className="md-card-title--title md-text">
                {title}
              </h2>
            </ClickToEdit>
            <h3 className="md-card-title--title md-text--secondary">{subtitle}</h3>
          </div>
        </div>
        <Link to={detailPath} title='More...'>
          <Gauge
            value={value}
            min={min}
            max={max}
            symbol={symbol}
            showLabel={false}
          />
        </Link>
        <CardText>
          <MiniTimelineChart readings={readings} units={units} />
        </CardText>
        {/*<CardActions></CardActions>*/}
      </Card>
    );
  }
}

export default props => (
  <SensorCardLogic {...props}>
    <SensorCardComponent />
  </SensorCardLogic>
);
