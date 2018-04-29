import React, { PureComponent } from 'react';
import PT from 'prop-types';
import { Link } from 'react-router-dom';
import {Avatar, Divider, List, ListItem, Subheader} from 'react-md';

import {Sensor} from '../fb/dataShapes';
import {vesselAvatar} from './helpers';


class SensorList extends PureComponent {

  static propTypes = {
    sensors: PT.arrayOf(PT.shape(Sensor)),
    units: PT.oneOf(['c', 'f']),
    active: PT.string,
  };

  static defaultProps = {
    sensors: [],
    units: 'f',
  };

  renderSensor = (sensor) => {
    const {uid, kind, displayName} = sensor;
    const {active} = this.props;

    const title = displayName || uid;
    const subtitle = kind === 'brite' ? 'Brite' : 'Fermenter';
    const avatar = vesselAvatar(kind);

    return (
      <ListItem
        key={uid}
        leftAvatar={avatar}
        primaryText={title}
        secondaryText={subtitle}
        active={active === uid}
        activeBoxClassName='md-list-tile--active'
        component={Link}
        to={`/readings/${uid}`}
      />
    );
  };

  render() {
    const {sensors} = this.props;
    return (
      <List>
        <Subheader primaryText="Monitored Vessels" />
        {sensors.map(this.renderSensor)}
      </List>
    );
  }
}

export default SensorList;
