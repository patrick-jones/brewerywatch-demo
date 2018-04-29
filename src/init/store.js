import { getStore } from 'kea'
import sagaPlugin from 'kea-saga';

import { routerReducer, routerMiddleware } from 'react-router-redux';
import history from './history';


const store = getStore({
  middleware: [
    routerMiddleware(history)
  ],
  reducers: {
    router: routerReducer,
  },
  plugins: [
    sagaPlugin,
  ],
  paths: ['kea', 'scenes', 'fb'],
});

export default store;

