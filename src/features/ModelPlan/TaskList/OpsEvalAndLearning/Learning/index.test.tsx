import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CcmInvolvmentType,
  GetLearningDocument,
  GetLearningQuery,
  TaskStatus
} from 'gql/generated/graphql';

import Learning from '.';

type GetLearningType = GetLearningQuery['modelPlan']['opsEvalAndLearning'];

const learningMockData: GetLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION],
  dataNeededForMonitoring: [],
  iddocSupport: true,
  modelLearningSystems: [],
  modelLearningSystemsOther: '',
  modelLearningSystemsNote: '',
  anticipatedChallenges: 'Hard challenges',
  readyForReviewByUserAccount: {
    commonName: 'ASDF',
    id: '000',
    __typename: 'UserAccount'
  },
  readyForReviewDts: '2022-05-12T15:01:39.190679Z',
  status: TaskStatus.IN_PROGRESS
};

const learningMock = [
  {
    request: {
      query: GetLearningDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: learningMockData,
          operationalNeeds: [
            {
              id: '780c990e-91f5-48a2-869a-59420940a533',
              modifiedDts: '2024-05-12T15:01:39.190679Z',
              __typename: 'OperationalNeed'
            }
          ]
        }
      }
    }
  }
];

describe('Model Plan Ops Eval and Learning - Learning', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/learning'
        ]}
      >
        <MockedProvider mocks={learningMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/learning">
            <Learning />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-learning-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'ops-eval-and-learning-learning-anticipated-challenges'
        )
      ).toHaveValue('Hard challenges');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/learning'
        ]}
      >
        <MockedProvider mocks={learningMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/learning">
            <Learning />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'ops-eval-and-learning-learning-anticipated-challenges'
        )
      ).toHaveValue('Hard challenges');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
