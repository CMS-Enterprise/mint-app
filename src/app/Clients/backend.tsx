import React from 'react';
import { toast } from 'react-toastify';
import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import Alert from 'components/Alert';
import { localAuthStorageKey } from 'constants/localAuth';
import { getCurrentErrorMeta } from 'contexts/ErrorContext/errorMetaStore';

const apiHost = new URL(import.meta.env.VITE_API_ADDRESS || '').host;

/**
 * Extract auth token from local storage and return a header
 */
export function getAuthHeader(targetUrl: string) {
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
  uri: import.meta.env.VITE_GRAPHQL_ADDRESS
});

const authLink = setContext((request, { headers }) => {
  const header = getAuthHeader(import.meta.env.VITE_GRAPHQL_ADDRESS as string);
  return {
    headers: {
      ...headers,
      authorization: header
    }
  };
});

/**
 * Helper function to determine operation type
 */
function getOperationType(
  operation: any
): 'query' | 'mutation' | 'subscription' | 'unknown' {
  try {
    const definition = operation.query.definitions[0];
    if (definition?.kind === 'OperationDefinition') {
      return definition.operation || 'unknown';
    }
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

const knownErrors: Record<string, string> = {
  uniq_contractor_name_per_solution_key:
    'This contractor is already added to this solution and cannot be added again. Please edit the existing entry.',
  uniq_user_id_per_solution_key:
    'This user is already added to this solution and cannot be added again. Please edit the existing entry.',
  uniq_mailbox_address_per_solution_key:
    'This mailbox address is already added to this solution and cannot be added again. Please edit the existing entry.'
};

const findKnownError = (errorMessage: string): string | undefined => {
  return Object.keys(knownErrors).find(key => errorMessage.includes(key));
};

/**
 * Error Link
 *
 * A link that intercepts GraphQL errors and displays them in a toast notification.
 * It also allows for overriding the error message for a specific component.
 */
const errorLink = onError(({ graphQLErrors, operation }) => {
  if (graphQLErrors) {
    const { overrideMessage, skipError } = getCurrentErrorMeta();
    const isReactNode = React.isValidElement(overrideMessage);
    const operationType = getOperationType(operation);

    graphQLErrors.forEach(err => {
      let errorMessage = '';

      let knownError: string | undefined;

      // Handle different operation types if needed
      switch (operationType) {
        case 'mutation':
          knownError = findKnownError(err.message);
          errorMessage = knownError ? knownErrors[knownError] : errorMessage;
          break;
        default:
          errorMessage = '';
      }

      if (operationType === 'mutation' && !skipError) {
        toast.error(
          <div>
            {isReactNode ? (
              overrideMessage
            ) : (
              <Alert
                type="error"
                heading="Something went wrong with your request. Please try again."
                isClosable={false}
              >
                <p className="margin-0">{overrideMessage || errorMessage}</p>
                <p className="margin-0">
                  If the problem persists, please contact support.
                </p>
              </Alert>
            )}
          </div>
        );
      }
    });
  }
});

const [protocol, gqlAddressWithoutProtocol] = (
  import.meta.env.VITE_GRAPHQL_ADDRESS as string
).split('://');

const wsProtocol = protocol === 'https' ? 'wss' : 'ws'; // Use WSS when connecting over HTTPs

const wsLink = new WebSocketLink(
  new SubscriptionClient(`${wsProtocol}://${gqlAddressWithoutProtocol}`, {
    reconnect: true,
    lazy: true,
    connectionParams: () => ({
      authToken: getAuthHeader(import.meta.env.VITE_GRAPHQL_ADDRESS as string)
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
  // TODO: Update package - apollo-upload-client (requires nodejs upgrade - https://jiraent.cms.gov/browse/EASI-3505)
  // @ts-ignore
  authLink.concat(uploadLink)
);

const client = new ApolloClient({
  link: errorLink.concat(splitLink),
  cache: new InMemoryCache({
    // Custom cache key for gql entities that have no `id` field, the default cache key for apollo
    typePolicies: {
      OperationalSolution: {
        keyFields: ['key', 'nameOther', 'id']
      },
      MTOSubcategory: {
        keyFields: false
      },
      LockableSectionLockStatus: {
        keyFields: ['lockedByUserAccount', ['id'], 'section', 'modelPlanID']
      },
      ModelsToOperationMatrix: {
        keyFields: ['info', ['id']]
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
});

export default client;
