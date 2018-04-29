import React, { PureComponent } from 'react';
import {Route, Redirect} from 'react-router-dom';

const encodeLocation = location => {
  return `${encodeURIComponent(location.pathname || '')}${encodeURIComponent(location.search || '')}${encodeURIComponent(location.hash || '')}`;
};

class PrivateRoute extends PureComponent {

  render() {
    const {user, location} = this.props;
    return (
      user ?
        <Route {...this.props} /> :
        <Redirect to={{
          pathname: '/pub/sign-in',
          search: `?state=${encodeLocation(location)}`,
          state: { from: this.props.location }
        }}
        />
    );
  }
}

export default PrivateRoute;
