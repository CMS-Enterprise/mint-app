import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetLearning from 'queries/OpsEvalAndLearning/GetLearning';
import { GetLearning_modelPlan_opsEvalAndLearning as GetLearningType } from 'queries/OpsEvalAndLearning/types/GetLearning';
import { CcmInvolvmentType, TaskStatus } from 'types/graphql-global-types';

import Learning from '.';

const learningMockData: GetLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION],
  iddocSupport: true,
  modelLearningSystems: [],
  modelLearningSystemsOther: '',
  modelLearningSystemsNote: '',
  anticipatedChallenges: 'Hard challenges',
  readyForReviewBy: 'ASDF',
  readyForReviewDts: '2022-05-12T15:01:39.190679Z',
  status: TaskStatus.IN_PROGRESS
};

const learningMock = [
  {
    request: {
      query: GetLearning,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: learningMockData,
          itTools: {
            status: TaskStatus.IN_PROGRESS
          }
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/ops-eval-and-learning/learning'
        ]}
      >
        <MockedProvider mocks={learningMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/ops-eval-and-learning/learning">
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/ops-eval-and-learning/learning'
        ]}
      >
        <MockedProvider mocks={learningMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/ops-eval-and-learning/learning">
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
