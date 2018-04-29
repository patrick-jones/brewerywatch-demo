import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';


import store from './init/store';
import history from './init/history';
import App from './App';

import './index.scss';

const $root = document.getElementById('root');

function renderApp() {
  const App = require('./App').default;
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    $root);
}

renderApp();
module.hot.accept(renderApp);
