import React, { PureComponent } from 'react';
import PT from 'prop-types';
import {connect} from 'kea';
import { push } from 'react-router-redux';

import {WholePageBusy} from '../common';
import {qs, LocationShape} from '../routing';
import authLogic from './authLogic';


const StartLogic = connect({
  actions: [
    authLogic, [
      'signIn',
      'signInError',
    ],
  ],
});


class StartComponent extends PureComponent {

  static propTypes = {
    location: PT.shape(LocationShape).isRequired,
    actions: PT.shape({
      setUser: PT.func,
      signIn: PT.func,
      signInError: PT.func,
    }).isRequired,
  };

  componentDidMount() {
    if (this.props.user) {
      this.completeSignIn();
    } else {
      const {location: {search}, actions: {signIn, signInError}} = this.props;
      const {token} = qs.parse(search);
      if (!token) {
        // error.....
        signInError('Missing sign-in token');
      } else {
        signIn(token);
      }
    }
  }

  componentDidUpdate() {
    if (this.props.user) {
      this.completeSignIn();
    }
  }

  completeSignIn = () => {
    const {dispatch, location: { search }} = this.props;
    const {returnTo} = qs.parse(search) || '/';
    dispatch(push(returnTo));
  };

  render() {
    return (
      <WholePageBusy message='Signing in...' />
    );
  }
}

export default StartLogic(StartComponent);

export {
  StartComponent,
  StartLogic,
};
