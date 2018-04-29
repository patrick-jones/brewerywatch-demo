import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import {kea} from 'kea';
import { withRouter, Route, Redirect, Switch } from 'react-router';

import {authLogic} from './auth';
import {WholePageBusy} from './common';
import {firebase} from './fb';
import {currentBrewer} from './util';

import PublicRouter from './PublicRouter';
import Top from './Top';

import './App.scss';

const AppLogic = kea({
  connect: {
    props: [
      authLogic,
      ['fbAuth'],
    ],
    actions: [
      authLogic, [
        'setTenant',
        'setUser',
      ],
    ],
  },
});

class AppComponent extends PureComponent {

  componentDidMount() {
    const {setUser, setTenant} = this.props.actions;
    setTenant(currentBrewer());
    firebase.auth().onAuthStateChanged(function(user) {
      setUser(user);
    });
  }

  renderPublic = (router) => {
    const { fbAuth, dispatch } = this.props;
    return (
      <PublicRouter router={router} user={fbAuth.user} dispatch={dispatch} />
    );
  };

  renderPrivate = (router) => {
    const { fbAuth } = this.props;
    if (fbAuth.user) {
      return (
        <Top router={router} tenant={fbAuth.tenant} user={fbAuth.user} />
      );
    } else {
      return (
        <Redirect to={{
          pathname: '/pub/sign-in',
          state: { from: this.props.location }
        }}
        />
      );
    }
  };

  render() {
    const { fbAuth } = this.props;
    if (fbAuth.userPending) {
      return (
        <WholePageBusy message='Loading...' />
      );
    } else {
      return (
        <Switch>
          <Route
            path="/pub"
            render={this.renderPublic}
          />
          <Route
            path="/"
            render={this.renderPrivate}
          />
        </Switch>
      );
    }
  }
}

export default hot(module)(withRouter(AppLogic(AppComponent)));
