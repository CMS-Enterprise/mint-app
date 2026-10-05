// ***********************************************************
// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
// ***********************************************************

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';
import cypressOTP from 'cypress-otp';
import fs from 'node:fs';
import path from 'node:path';

import {
  LockableSection,
  LockModelPlanSectionDocument
} from '../../src/gql/generated/graphql';

const cache = new InMemoryCache();

function createApolloClient(euaId: string) {
  const gqlURL =
    process.env.VITE_GRAPHQL_ADDRESS || 'http://localhost:8085/api/graph/query';

  return new ApolloClient({
    cache,
    link: new HttpLink({
      uri: gqlURL,
      fetch,
      headers: {
        // need job code to be able to issue LCID
        Authorization: `Local {"euaId":"${euaId}", "favorLocalAuth":true, "jobCodes":["MINT_USER_NONPROD"]}`
      }
    })
  });
}

function lockTaskListSection({
  euaId,
  modelPlanID,
  section
}: {
  euaId: string;
  modelPlanID: string;
  section: LockableSection;
}) {
  const apolloClient = createApolloClient(euaId);
  const input = {
    modelPlanID,
    section
  };

  // need to return this Promise to indicate to Cypress that the task was handled
  // https://on.cypress.io/task
  return apolloClient.mutate({
    mutation: LockModelPlanSectionDocument,
    variables: input
  });
}

function deleteFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  return null;
}

function deleteAllFiles(folderPath: string) {
  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    fs.unlinkSync(path.join(folderPath, file));
  });
  return null;
}

function createFolderIfNotExists(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  return null;
}

const setupNodeEvents = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
):
  | void
  | Cypress.PluginConfigOptions
  | Promise<void | Cypress.PluginConfigOptions> => {
  on('task', {
    generateOTP: cypressOTP,
    lockTaskListSection,
    deleteFile,
    deleteAllFiles,
    createFolderIfNotExists
  });

  const newConfig = config;
  newConfig.env.oktaDomain = process.env.OKTA_DOMAIN;
  newConfig.env.username = process.env.OKTA_TEST_USERNAME;
  newConfig.env.password = process.env.OKTA_TEST_PASSWORD;
  newConfig.env.otpSecret = process.env.OKTA_TEST_SECRET;

  return newConfig;
};

export default setupNodeEvents;
