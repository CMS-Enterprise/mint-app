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
  CreateModelPlanCollaboratorDocument,
  CreateModelPlanDiscussionDocument,
  CreateMtoCommonMilestoneDocument,
  DiscussionTopicType,
  DiscussionUserRole,
  GetModelPlansDocument,
  LockableSection,
  LockModelPlanSectionDocument,
  ModelPlanFilter,
  MtoCommonSolutionKey,
  MtoFacilitator,
  TeamRole
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

// Model plan IDs are random per seed, so tasks look plans up by name.
async function findModelPlanID(
  apolloClient: ReturnType<typeof createApolloClient>,
  modelName: string
) {
  const { data } = await apolloClient.query({
    query: GetModelPlansDocument,
    variables: { filter: ModelPlanFilter.INCLUDE_ALL, isMAC: false },
    fetchPolicy: 'no-cache'
  });

  const plan = data.modelPlanCollection.find(
    (modelPlan: { modelName: string }) => modelPlan.modelName === modelName
  );

  if (!plan) {
    throw new Error(`No model plan named "${modelName}" found for this user`);
  }

  return plan.id;
}

// The following tasks trigger the same backend mutations as the UI forms, so a spec can set
// up an event (e.g. to generate a notification) without clicking through the form. The forms
// themselves are covered by their own specs.
async function createDiscussion({
  euaId,
  jobCodes,
  modelPlanName,
  content,
  topic = DiscussionTopicType.MODEL_PLAN_MODEL_BASICS,
  userRole = DiscussionUserRole.MINT_TEAM,
  userRoleDescription = null
}: {
  euaId: string;
  jobCodes?: string[];
  modelPlanName: string;
  // Rich text HTML; mentions use the editor's <span data-type="mention" ...> markup
  content: string;
  topic?: DiscussionTopicType;
  userRole?: DiscussionUserRole;
  userRoleDescription?: string | null;
}) {
  const apolloClient = createApolloClient(euaId, jobCodes);
  const modelPlanID = await findModelPlanID(apolloClient, modelPlanName);

  const { data } = await apolloClient.mutate({
    mutation: CreateModelPlanDiscussionDocument,
    variables: {
      input: { modelPlanID, content, topic, userRole, userRoleDescription }
    }
  });

  return data?.createPlanDiscussion?.id ?? null;
}

async function addCollaborator({
  euaId,
  jobCodes,
  modelPlanName,
  userName,
  teamRoles
}: {
  euaId: string;
  jobCodes?: string[];
  modelPlanName: string;
  userName: string;
  teamRoles: TeamRole[];
}) {
  const apolloClient = createApolloClient(euaId, jobCodes);
  const modelPlanID = await findModelPlanID(apolloClient, modelPlanName);

  const { data } = await apolloClient.mutate({
    mutation: CreateModelPlanCollaboratorDocument,
    variables: { input: { modelPlanID, userName, teamRoles } }
  });

  return data?.createPlanCollaborator?.id ?? null;
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

// TOTP codes rotate every 30s. Generating one in the last few seconds makes Okta
// reject it by the time the form is submitted, which shows up as a flake on the
// OTP step. Wait for the next window when the current one is about to roll.
function generateOTP(secret?: string): Promise<string> {
  const stepSeconds = 30;
  const safetySeconds = 8;
  const remaining = stepSeconds - (Math.floor(Date.now() / 1000) % stepSeconds);
  const delayMs = remaining < safetySeconds ? (remaining + 1) * 1000 : 0;

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(cypressOTP(secret));
    }, delayMs);
  });
}

const setupNodeEvents = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
):
  | void
  | Cypress.PluginConfigOptions
  | Promise<void | Cypress.PluginConfigOptions> => {
  on('task', {
    generateOTP,
    lockTaskListSection,
    createCommonMilestone,
    createDiscussion,
    addCollaborator,
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
