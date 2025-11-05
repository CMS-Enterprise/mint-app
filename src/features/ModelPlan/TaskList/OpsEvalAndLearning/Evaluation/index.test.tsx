import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CcmInvolvmentType,
  EvaluationApproachType,
  GetEvaluationDocument,
  GetEvaluationQuery
} from 'gql/generated/graphql';

import Evaluation from '.';

type GetEvaluationType = GetEvaluationQuery['modelPlan']['opsEvalAndLearning'];

const evaluationMockData: GetEvaluationType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION],
  iddocSupport: true,
  evaluationApproaches: [EvaluationApproachType.COMPARISON_MATCH],
  evaluationApproachOther: '',
  evaluationApproachNote: '',
  ccmInvolvmentOther: '',
  ccmInvolvmentNote: '',
  dataNeededForMonitoring: [],
  dataNeededForMonitoringOther: '',
  dataNeededForMonitoringNote: '',
  dataToSendParticicipants: [],
  dataToSendParticicipantsOther: '',
  dataToSendParticicipantsNote: '',
  shareCclfData: true,
  shareCclfDataNote: ''
};

const evaluationMock = [
  {
    request: {
      query: GetEvaluationDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: evaluationMockData,
          operationalNeeds: [
            {
              __typename: 'OperationalNeed',
              id: '424213',
              modifiedDts: null
            }
          ]
        }
      }
    }
  }
];

describe('Model Plan Ops Eval and Learning', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/evaluation',
          element: <Evaluation />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/evaluation'
        ]
      }
    );

    render(
      <MockedProvider mocks={evaluationMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-evaluation-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-share-cclf-data-true')
      ).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/evaluation',
          element: <Evaluation />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/evaluation'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={evaluationMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-share-cclf-data-true')
      ).toBeChecked();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
