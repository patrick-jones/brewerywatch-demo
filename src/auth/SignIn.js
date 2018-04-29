import React, { PureComponent } from 'react';
import {kea} from 'kea';

import {Link} from 'react-router-dom'
import { Button, Cell, Paper, TextField } from 'react-md';


import {qs} from '../routing';

import authLogic from './authLogic';

import badge from '../assets/badge.svg';
import './SignIn.scss';


function returnToFromState(history, location) {
  const from = location.state ? location.state.from : null;
  return from ? '?' + qs.stringify({returnTo: history.createHref(from)}) : '';
}


function returnToFromQuery(location) {
  const search = location.search || '';
  const query = qs.parse(search);
  if (query.returnTo) {
    return '?' + qs.stringify({returnTo: query.returnTo})
  }
  return '';
}

const SignInLogic = kea({
  connect: {
    actions: [
      authLogic, [
        'setUser',
      ],
    ],
  },
});

class SignInComponent extends PureComponent {

  render() {
    const {history, location, origin, hostname} = this.props;
    const state = returnToFromQuery(location) || returnToFromState(history, location);
    const selfURI = `${origin}${location.pathname}${state}`;
    const successURI = `${origin}/pub/start${state}`;
    const redirectURI = `https://${hostname}/_/session`;
    const signInURI = `https://${hostname}/authentication/sign-in`;
    const [appid, ..._] = hostname.split('.');
    return (
      <div className='sign-in-page'>
        <form noValidate method='POST' action={signInURI} className='sign-in-form'>
          <input type='hidden' name='application' value={appid} />
          <input type='hidden' name='redirect_uri' value={redirectURI} />
          <input type='hidden' name='success_uri' value={successURI} />
          <input type='hidden' name='error_uri' value={selfURI} />
          <div className='sign-in-form__header'>
            <img src={badge} alt='logo' className='' />
          </div>
          <div className="md-grid sign-in-form__body">
            <TextField
              id="username"
              name="username"
              label="Email Address"
              placeholder="you@your-brewery.com"
              autoComplete="username"
              className={Cell.getClassName({ size: 12, align: 'bottom' })}
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              className={Cell.getClassName({ size: 12, align: 'bottom' })}
            />

            <p className={'md-text-center ' + Cell.getClassName({ size: 12, align: 'bottom' })}>
              <Link to='/'>Forgot your password?</Link>
            </p>
          </div>
          <Button
            raised
            primary
            type='submit'
            className={'sign-in-form__button ' + Cell.getClassName({ size: 12, align: 'bottom' })}
          >
            Sign In
          </Button>
        </form>
      </div>
    );
  }
}

export default SignInLogic(SignInComponent);

export {
  SignInLogic,
  SignInComponent,
};
