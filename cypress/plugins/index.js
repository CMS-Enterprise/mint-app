// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const cypressOTP = require('cypress-otp');
const wp = require('@cypress/webpack-preprocessor');
const apollo = require('@apollo/client');
const fetch = require('cross-fetch'); // needed to allow apollo-client to make queries from Node environment

const {
  LockModelPlanSectionDocument
} = require('../../src/gql/generated/graphql');

const cache = new apollo.InMemoryCache();

function createApolloClient(euaId) {
  const gqlURL =
    process.env.VITE_GRAPHQL_ADDRESS || 'http://localhost:8085/api/graph/query';

  return new apollo.ApolloClient({
    cache,
    link: new apollo.HttpLink({
      uri: gqlURL,
      fetch,
      headers: {
        // need job code to be able to issue LCID
        Authorization: `Local {"euaId":"${euaId}", "favorLocalAuth":true, "jobCodes":["MINT_USER_NONPROD"]}`
      }
    })
  });
}

function lockTaskListSection({ euaId, modelPlanID, section }) {
  const apolloClient = createApolloClient(euaId);
  const input = {
    modelPlanID,
    section
  };
  // need to return this Promise to indicate to Cypress that the task was handled
  // https://docs.cypress.io/api/commands/task#Usage - "The command will fail if undefined is returned or if the promise is resolved with undefined."
  return apolloClient.mutate({
    mutation: LockModelPlanSectionDocument,
    variables: input
  });
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    generateOTP: cypressOTP,
    lockTaskListSection
  });

  const options = {
    webpackOptions: {
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: { transpileOnly: true }
          }
        ]
      }
    }
  };
  on('file:preprocessor', wp(options));

  const newConfig = config;
  newConfig.env.oktaDomain = process.env.OKTA_DOMAIN;
  newConfig.env.username = process.env.OKTA_TEST_USERNAME;
  newConfig.env.password = process.env.OKTA_TEST_PASSWORD;
  newConfig.env.otpSecret = process.env.OKTA_TEST_SECRET;

  return config;
};
