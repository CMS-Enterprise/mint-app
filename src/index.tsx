import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga4';
import { Provider } from 'react-redux';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  split
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import axios from 'axios';
import { detect } from 'detect-browser';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { TextEncoder } from 'text-encoding';

import { localAuthStorageKey } from 'constants/localAuth';

import './i18n';

import App from './views/App';
import UnsupportedBrowser from './views/UnsupportedBrowser';
import * as serviceWorker from './serviceWorker';
import store from './store';

import './index.scss';

const apiHost = new URL(process.env.REACT_APP_API_ADDRESS || '').host;

ReactGA.initialize([
  {
    trackingId: 'G-45PX7VBWQK',
    gaOptions: {}, // optional
    gtagOptions: {} // optional
  }
]);

/**
 * Extract auth token from local storage and return a header
 */
function getAuthHeader(targetUrl: string) {
  const targetHost = new URL(targetUrl).host;
  if (targetHost !== apiHost) {
    return null;
  }

  // prefer dev auth if it exists
  if (
    window.localStorage[localAuthStorageKey] &&
    JSON.parse(window.localStorage[localAuthStorageKey]).favorLocalAuth
  ) {
    return `Local ${window.localStorage[localAuthStorageKey]}`;
  }

  if (window.localStorage['okta-token-storage']) {
    const json = JSON.parse(window.localStorage['okta-token-storage']);
    if (json.accessToken) {
      return `Bearer ${json.accessToken.accessToken}`;
    }
  }

  return null;
}

/**
 * Setup client for GraphQL
 */
const uploadLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_ADDRESS
});

const authLink = setContext((request, { headers }) => {
  const header = getAuthHeader(process.env.REACT_APP_GRAPHQL_ADDRESS as string);
  return {
    headers: {
      ...headers,
      authorization: header
    }
  };
});

const [protocol, gqlAddressWithoutProtocol] = (process.env
  .REACT_APP_GRAPHQL_ADDRESS as string).split('://');
const wsProtocol = protocol === 'https' ? 'wss' : 'ws'; // Use WSS when connecting over HTTPs
const wsLink = new WebSocketLink(
  new SubscriptionClient(`${wsProtocol}://${gqlAddressWithoutProtocol}`, {
    reconnect: true,
    lazy: true,
    connectionParams: () => ({
      authToken: getAuthHeader(process.env.REACT_APP_GRAPHQL_ADDRESS as string)
    })
  })
);

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(uploadLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      OperationalSolution: {
        keyFields: ['key', 'nameOther', 'id']
      },
      TaskListSectionLockStatus: {
        keyFields: ['lockedByUserAccount', ['id'], 'section', 'modelPlanID']
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
});

let app;
const browser: any = detect();
if (browser.name === 'ie') {
  app = <UnsupportedBrowser />;
} else {
  app = (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
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

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
