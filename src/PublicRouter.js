import React, { PureComponent } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';

import {SignIn} from './auth/index';
import NotFound from './routing/NotFound';
import Start from './auth/Start';

class PublicRouter extends PureComponent {

  renderSignIn = ({ location, history }) => {
    return (
      <SignIn
        hostname={window.location.hostname}
        origin={window.location.origin}
        location={location}
        history={history}
      />
    );
  };

  renderStart = ({location}) => {
    const {user} = this.props;
    return (
      <Start location={location} user={user} />
    );
  };

  render() {
    const { router } = this.props;
    const {match} = router;
    const prefix = match.path;
    return (
      <Switch>
        <Route path={`${prefix}/sign-in`} render={this.renderSignIn} />
        <Route path={`${prefix}/start`} render={this.renderStart} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default withRouter(PublicRouter);
