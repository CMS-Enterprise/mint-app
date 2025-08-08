import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CcmInvolvmentType,
  GetIddocMonitoringDocument,
  GetIddocMonitoringQuery
} from 'gql/generated/graphql';

import IDDOCMonitoring from './index';

type GetIDDOCMonitoringType =
  GetIddocMonitoringQuery['modelPlan']['opsEvalAndLearning'];

const iddocMonitoringMockData: GetIDDOCMonitoringType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION],
  dataNeededForMonitoring: [],
  iddocSupport: true,
  dataFullTimeOrIncremental: null,
  eftSetUp: null,
  unsolicitedAdjustmentsIncluded: null,
  dataFlowDiagramsNeeded: null,
  produceBenefitEnhancementFiles: null,
  fileNamingConventions: '.pdf',
  dataMonitoringNote: ''
};

const iddocMonitoringMock = [
  {
    request: {
      query: GetIddocMonitoringDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: iddocMonitoringMockData
        }
      }
    }
  }
];

describe('Model Plan Ops Eval and Learning IDDOC', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/iddoc-monitoring',
          element: <IDDOCMonitoring />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/iddoc-monitoring'
        ]
      }
    );

    render(
      <MockedProvider mocks={iddocMonitoringMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-iddoc-monitoring-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-file-naming-convention')
      ).toHaveValue('.pdf');
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/iddoc-monitoring',
          element: <IDDOCMonitoring />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/iddoc-monitoring'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={iddocMonitoringMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-file-naming-convention')
      ).toHaveValue('.pdf');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
