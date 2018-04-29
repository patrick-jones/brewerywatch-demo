import React, { PureComponent } from 'react';
import PT from 'prop-types';
import { Button, SelectField, Toolbar } from 'react-md';

import ProfileAvatar from './ProfileAvatar';

import './AppBar.scss';

class AppBar extends PureComponent {

  static propTypes = {
    onProfileVisible: PT.func.isRequired,
    profileVisible: PT.bool.isRequired,
    data: PT.shape({
      brewery: PT.shape({
        displayName: PT.string,
      }),
      profile: PT.shape({
        photoURL: PT.string,
        displayName: PT.string,
      }),
    }),
    onTopNavigation: PT.func.isRequired,
    currentPath: PT.string,
  };

  static defaultProps = {
    profileVisible: false,
    currentPath: '',
  };

  handleShowProfile = () => {
    this.props.onProfileVisible(!this.props.profileVisible);
  };

  handleTopNavigation = (value) => {
    this.props.onTopNavigation(value)
  };

  render() {
    const {data: {brewery={displayName: 'Your Brewery'}, profile}, currentPath} = this.props;
    const value = currentPath.startsWith('/archive') ? '/archive' : '/readings';
    return (
      <Toolbar
        titleMenu={
          <SelectField
            id='main-nav-menu'
            menuItems={[
              {label: `${brewery.displayName} - Live Readings`, value: '/readings'},
              {label: `${brewery.displayName} - Archive`, value: '/archive'},
            ]}
            value={value}
            onChange={this.handleTopNavigation}
          />
        }
        colored={true}
        singleColor={true}
        fixed={true}
        actions={
          <Button
            className='md-button--avatar'
            icon
            onClick={this.handleShowProfile}
          >
            <ProfileAvatar profile={profile} />
          </Button>
        }
      />
    );
  }
}

export default AppBar;
