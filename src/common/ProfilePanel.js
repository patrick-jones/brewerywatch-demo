import React, { Component, Fragment } from 'react';
import PT from 'prop-types';
import {call, put} from 'redux-saga/effects';

import {Button, List, ListItemControl, Paper, Switch, Subheader} from 'react-md';
import { Link } from 'react-router-dom';

import managedComponent from './managedComponent';
import {firebase} from '../fb';

import ProfileAvatar from './ProfileAvatar';

import './ProfilePanel.scss';


const ProfileManager = managedComponent({
  path: () => ['scenes', 'profile', 'profilePanel'],

  actions: () => ({
    setUnits: (tenant, userid, units) => ({tenant, userid, units}),
  }),

  takeEvery: ({ actions }) => ({
    [actions.setUnits]: function* ({payload: {tenant, userid, units}}) {
      try {
        const docRef = firebase.firestore().doc(`breweries/${tenant}/profiles/${userid}`);
        yield call([docRef, docRef.update], {
          units
        });
      } catch (e) {
        console.log(e);
      }
    },
  }),
});


class ProfilePanelComponent extends Component {

  static propTypes = {
    onProfileVisible: PT.func,
    onSignOut: PT.func,
  };

  handleClose = () => {
    this.props.onProfileVisible(false);
  };

  handleSelectFahrenheit = (yes) => {
    const {actions: {setUnits}, tenant, user: {uid}} = this.props;
    const units = yes ? 'f' : 'c';
    setUnits(tenant, uid, units);
  };

  handleSelectCelsius = (yes) => {
    this.handleSelectFahrenheit(!yes);
  };

  render() {
    const {user, profile, brewery, onSignOut, actions: {setUnits}} = this.props;
    const {units='f'} = profile;
    return (
      <Fragment>
        <div className='profile-panel--close-button'>
          <Button icon onClick={this.handleClose}>close</Button>
        </div>
        <Paper zDepth={1} className='profile-panel--header'>
          <ProfileAvatar profile={profile} large />
          <h1 className='md-headline'>{profile.displayName}</h1>
          <p className='md-caption'>User ID: {user.uid}</p>
          <p className='md-caption'>{user.email}</p>
          <p className='md-caption'><Link to={`/account/${user.uid}`}>My Account</Link> | <a href='#' onClick={onSignOut}>Sign Out</a></p>
        </Paper>
        <div className='profile-panel--body'>
          <List>
            <Subheader primaryText='Units'/>
            <ListItemControl
              id='profile-panel-fahrenheit'
              name='profile-panel-fahrenheit'
              primaryText='Fahrenheit'
              primaryAction={
                <Switch
                  id='profile-panel-switch-fahrenheit'
                  name='profile-panel-switch-fahrenheit'
                  checked={units !== 'c'}
                  value='f'
                  onChange={this.handleSelectFahrenheit}
                />
              }
            />
            <ListItemControl
              id='profile-panel-celsius'
              name='profile-panel-celsius'
              primaryText='Celsius'
              primaryAction={
                <Switch
                  id='profile-panel-switch-celsius'
                  name='profile-panel-switch-celsius'
                  checked={units === 'c'}
                  value='c'
                  onChange={this.handleSelectCelsius}
                />
              }
            />
          </List>
        </div>
      </Fragment>
    );
  }
}

const ProfilePanel = props => (
  <ProfileManager {...props}>
    <ProfilePanelComponent />
  </ProfileManager>
);

ProfilePanel.propTypes = {
  onProfileVisible: PT.func.isRequired,
  onSignOut: PT.func.isRequired,
};

export default ProfilePanel;
