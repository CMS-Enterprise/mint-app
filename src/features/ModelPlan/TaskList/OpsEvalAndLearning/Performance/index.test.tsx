import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CcmInvolvmentType,
  GetPerformanceDocument,
  GetPerformanceQuery
} from 'gql/generated/graphql';
import { modelPlanBaseMock } from 'tests/mock/general';

import ModelInfoWrapper from 'contexts/ModelInfoContext';

import Performance from '.';

type GetPerformanceType =
  GetPerformanceQuery['modelPlan']['opsEvalAndLearning'];

const performanceMockData: GetPerformanceType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION],
  dataNeededForMonitoring: [],
  iddocSupport: true,
  benchmarkForPerformance: null,
  benchmarkForPerformanceNote: '',
  computePerformanceScores: true,
  computePerformanceScoresNote: '',
  riskAdjustPerformance: null,
  riskAdjustFeedback: null,
  riskAdjustPayments: null,
  riskAdjustOther: null,
  riskAdjustNote: '',
  appealPerformance: null,
  appealFeedback: null,
  appealPayments: null,
  appealOther: null,
  appealNote: ''
};

const performanceMock = [
  {
    request: {
      query: GetPerformanceDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: performanceMockData,
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
  },
  ...modelPlanBaseMock
];

describe('Model Plan Ops Eval and Learning Performance', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/performance',
          element: (
            <ModelInfoWrapper>
              <Performance />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/performance'
        ]
      }
    );

    render(
      <MockedProvider mocks={performanceMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-performance-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-compute-performance-true')
      ).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/performance',
          element: (
            <ModelInfoWrapper>
              <Performance />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/performance'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={performanceMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-compute-performance-true')
      ).toBeChecked();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
