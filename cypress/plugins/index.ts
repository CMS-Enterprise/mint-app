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
  CreateMtoCommonMilestoneDocument,
  LockableSection,
  LockModelPlanSectionDocument,
  MtoCommonSolutionKey,
  MtoFacilitator
} from '../../src/gql/generated/graphql';

const cache = new InMemoryCache();

function createApolloClient(
  euaId: string,
  jobCodes: string[] = ['MINT_USER_NONPROD']
) {
  const gqlURL =
    process.env.VITE_GRAPHQL_ADDRESS || 'http://localhost:8085/api/graph/query';

  return new ApolloClient({
    cache,
    link: new HttpLink({
      uri: gqlURL,
      fetch,
      headers: {
        // need job code to be able to issue LCID
        Authorization: `Local ${JSON.stringify({
          euaId,
          favorLocalAuth: true,
          jobCodes
        })}`
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

// The common milestone library comes from migrations and is not reset by `db:clean`,
// so specs that edit/remove a milestone create their own uniquely named one to stay re-runnable.
function createCommonMilestone({
  name,
  categoryName = 'Learning',
  facilitatedByRole = [MtoFacilitator.IT_LEAD],
  // The edit form requires at least one common solution
  commonSolutions = [MtoCommonSolutionKey.ACO_OS]
}: {
  name: string;
  categoryName?: string;
  facilitatedByRole?: MtoFacilitator[];
  commonSolutions?: MtoCommonSolutionKey[];
}) {
  // Creating a common milestone requires the assessment role
  const apolloClient = createApolloClient('JTTC', ['MINT_ASSESSMENT_NONPROD']);

  return apolloClient
    .mutate({
      mutation: CreateMtoCommonMilestoneDocument,
      variables: {
        name,
        description: 'Created by Cypress',
        categoryName,
        facilitatedByRole,
        commonSolutions
      }
    })
    .then(result => result.data?.createMTOCommonMilestone ?? null);
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
    createCommonMilestone,
    deleteFile,
    deleteAllFiles,
    createFolderIfNotExists
  });

  // Only keep videos for specs with a failed attempt; delete the rest so they
  // aren't stored or uploaded.
  on('after:spec', (_spec, results) => {
    if (!results?.video) return;

    const hasFailure = results.tests?.some(test =>
      test.attempts?.some(attempt => attempt.state === 'failed')
    );

    if (!hasFailure) {
      fs.rmSync(results.video, { force: true });
    }
  });

  const newConfig = config;
  newConfig.env.oktaDomain = process.env.OKTA_DOMAIN;
  newConfig.env.username = process.env.OKTA_TEST_USERNAME;
  newConfig.env.password = process.env.OKTA_TEST_PASSWORD;
  newConfig.env.otpSecret = process.env.OKTA_TEST_SECRET;

  return newConfig;
};

export default setupNodeEvents;
