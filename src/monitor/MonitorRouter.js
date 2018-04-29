import React, { Component } from 'react';
import PT from 'prop-types';
import {Route, Redirect, Switch} from 'react-router';

import {NotFound, RoutePropsShape} from '../routing';
import {Dashboard, Archive} from './index';
import {ProfileShape, UserShape} from '../auth';


class MonitorRouter extends Component {

  static propTypes = {
    user: PT.shape(UserShape),
    profile: PT.shape(ProfileShape),
    roles: PT.object,
    brewery: PT.object,
    tenant: PT.string.isRequired,
    router: PT.shape(RoutePropsShape),
  };

  render() {
    return (
      <Switch>
        <Route
          path='/archive/:uid?'
          render={({location, match: {params}}) => {
            const {uid} = params;
            return (
              <Archive
                uid={uid}
                {...this.props}
              />
            );
          }}
        />
        <Route
          path='/readings/:uid?'
          render={({location, match: {params}}) => {
            const {uid} = params;
            return (
              <Dashboard
                uid={uid}
                {...this.props}
              />
            );
          }}
        />
        <Redirect
          exact
          from='/'
          to='/readings'
        />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default MonitorRouter;
