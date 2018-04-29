import React, {Fragment, PureComponent} from 'react';
import PT from 'prop-types';
import {kea} from 'kea';

import { Button, Drawer, FontIcon, Toolbar } from 'react-md';

import { push } from 'react-router-redux';
import authLogic from './auth/authLogic';

import {Firestore} from './fb';
import {AppBar, ProfilePanel, AppSnackbar} from './common';

import {MonitorRouter} from './monitor';
import ErrorBoundary from './common/ErrorBoundary';


const uiStateShape = {
  profileVisible: PT.bool.isRequired,
};


const uiStateDefault = {
  profileVisible: false,
};

const TopLogic = kea({
  path: () => ['scenes', 'top'],


  connect: {
    actions: [
      authLogic, [
        'signOut',
      ],
    ],
  },

  actions: () => ({
    onProfileVisible: profileVisible => ({profileVisible}),
  }),

  reducers: ({actions}) => ({
    uiState: [uiStateDefault, PT.shape(uiStateShape), {
      [actions.onProfileVisible]: (state, {profileVisible}) => ({...state, profileVisible}),
    }],
  })
});

class TopComponent extends PureComponent {

  static propTypes = {
    actions: PT.shape({
      signOut: PT.func.isRequired,
      onProfileVisible: PT.func.isRequired,
    }),
    uiState: PT.shape(uiStateShape),
  };

  handleSignOut = () => {
    const {actions: {signOut}, dispatch} = this.props;
    signOut();
    dispatch(push('/'));
  };

  handleTopNavigation = path => {
    const {dispatch} = this.props;
    dispatch(push(path));
  };

  render() {
    const {tenant, user} = this.props;
    return (
        <Firestore
          id='top'
          subs={{
            profile: `breweries/${tenant}/profiles/${user.uid}`,
            roles: `breweries/${tenant}/roles/${user.uid}`,
            brewery: `breweries/${tenant}`,
            preferences: `breweries/${tenant}/preferences/${user.uid}`
          }}
        >
          {({data, errors, references}) => {
            const {actions, uiState, router} = this.props;
            const {location: {pathname}} = router;
            return (
              <Fragment>
                <AppBar
                  data={data}
                  errors={errors}
                  onProfileVisible={actions.onProfileVisible}
                  profileVisible={uiState.profileVisible}
                  onTopNavigation={this.handleTopNavigation}
                  currentPath={pathname}
                />
                <main tabIndex='-1' className='md-navigation-drawer-content md-navigation-drawer-content--inactive md-transition--acceleration md-toolbar-relative'>
                  <MonitorRouter tenant={tenant} user={user} {...data} references={references} router={router} />
                </main>
                <Drawer
                  type={Drawer.DrawerTypes.TEMPORARY}
                  visible={uiState.profileVisible}
                  position='right'
                  overlay={true}
                  overlayClassName='md-overlay--clear'
                  onVisibilityChange={actions.onProfileVisible}
                  className='profile-panel'
                >
                  <ProfilePanel
                    user={user}
                    tenant={tenant}
                    {...data}
                    onProfileVisible={actions.onProfileVisible}
                    onSignOut={this.handleSignOut}
                  />
                </Drawer>
                <ErrorBoundary>
                  <AppSnackbar />
                </ErrorBoundary>
              </Fragment>
            );
          }}
        </Firestore>
    );
  }
}

export default TopLogic(TopComponent);

export {
  TopComponent,
  TopLogic,
};
