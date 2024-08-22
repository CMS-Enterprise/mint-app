import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { GetModelPlanDocument, TaskStatus } from 'gql/gen/graphql';

import VerboseMockedProvider from 'utils/testing/MockedProvider';
import setup from 'utils/testing/setup';

import ModelPlanCard from './index';

const modelID: string = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const modelPlanMocks = [
  {
    request: {
      query: GetModelPlanDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          taskListStatus: TaskStatus.READY,
          modifiedDts: '2021-08-10T14:00:00Z',
          modifiedByUserAccount: {
            __typename: 'UserAccount',
            commonName: 'John Doe'
          },
          basics: {
            __typename: 'PlanBasics',
            status: TaskStatus.READY
          },
          generalCharacteristics: {
            __typename: 'PlanGeneralCharacteristics',
            status: TaskStatus.READY
          },
          participantsAndProviders: {
            __typename: 'PlanParticipantsAndProviders',
            status: TaskStatus.READY
          },
          beneficiaries: {
            __typename: 'PlanBeneficiaries',
            status: TaskStatus.READY
          },
          opsEvalAndLearning: {
            __typename: 'PlanOpsEvalAndLearning',
            status: TaskStatus.READY
          },
          payments: {
            __typename: 'PlanBasics',
            status: TaskStatus.READY
          },
          operationalNeeds: [
            {
              __typename: 'OperationalNeed',
              modifiedDts: ''
            }
          ]
        }
      }
    }
  }
];

describe('ModelPlanCard', () => {
  it('renders without issues', async () => {
    const { getByText, queryByText } = setup(
      <MemoryRouter initialEntries={[`/models/${modelID}/collaboration-area`]}>
        <VerboseMockedProvider mocks={modelPlanMocks} addTypename={false}>
          <ModelPlanCard modelID={modelID} setStatusMessage={() => null} />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(getByText('Model Plan')).toBeInTheDocument();
    expect(
      queryByText('Most recent edit on 08/21/2024 by')
    ).not.toBeInTheDocument();
  });

  it('matches the snapshot', async () => {
    const { asFragment } = setup(
      <MemoryRouter initialEntries={[`/models/${modelID}/collaboration-area`]}>
        <VerboseMockedProvider mocks={modelPlanMocks} addTypename={false}>
          <ModelPlanCard modelID={modelID} setStatusMessage={() => null} />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
