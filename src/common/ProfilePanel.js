import React, { PureComponent, Fragment } from 'react';
import PT from 'prop-types';
import {Button, Media, MediaOverlay, Paper, Toolbar} from 'react-md';
import { Link } from 'react-router-dom';

import ProfileAvatar from './ProfileAvatar';

import './ProfilePanel.scss';

class ProfilePanel extends PureComponent {

  static propTypes = {
    onProfileVisible: PT.func.isRequired,
    onSignOut: PT.func.isRequired,
  };

  handleClose = () => {
    this.props.onProfileVisible(false);
  };

  render() {
    const {user, profile, brewery, onSignOut} = this.props;
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
        </div>
      </Fragment>
    );
  }
}

export default ProfilePanel;
