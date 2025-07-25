import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga4';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import axios from 'axios';
import { detect } from 'detect-browser';
import { TextEncoder } from 'text-encoding';

import '../config/i18n';

import * as serviceWorker from '../config/serviceWorker';
import store from '../config/store';
import UnsupportedBrowser from '../features/UnsupportedBrowser';

import client, { getAuthHeader } from './Clients/backend';
import AppComponent from './Routes';

import './index.scss';

const trackingID = import.meta.env.VITE_GA_TRACKING_ID;
if (trackingID) {
  ReactGA.initialize([
    {
      trackingId: trackingID,
      gaOptions: {}, // optional
      gtagOptions: {} // optional
    }
  ]);
}

let App;
const browser: any = detect();
if (browser.name === 'ie') {
  App = <UnsupportedBrowser />;
} else {
  App = (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <AppComponent />
      </ApolloProvider>
    </Provider>
  );
}

/**
 * expose store when run in Cypress
 */
if (window.Cypress) {
  window.store = store;
}

/**
 * axios interceptor to add authorization tokens to all requests made to
 * our application API
 */
axios.interceptors.request.use(
  config => {
    const newConfig = config;

    if (newConfig && newConfig.url) {
      const header = getAuthHeader(newConfig.url);
      if (header) {
        newConfig.headers.Authorization = header;
      }
    }

    return newConfig;
  },
  error => {
    Promise.reject(error);
  }
);

/**
 * text-encoding isn't supported in IE11. This polyfill is needed for us
 * to show the browser support error message. If this is not here, the
 * user will see a blank white screen
 */
if (typeof (window as any).TextEncoder === 'undefined') {
  (window as any).TextEncoder = TextEncoder;
}

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
