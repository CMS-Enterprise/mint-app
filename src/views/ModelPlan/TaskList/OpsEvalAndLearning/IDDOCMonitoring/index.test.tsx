import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetIDDOCMonitoring from 'queries/OpsEvalAndLearning/GetIDDOCMonitoring';
import { GetIDDOCMonitoring_modelPlan_opsEvalAndLearning as GetIDDOCMonitoringType } from 'queries/OpsEvalAndLearning/types/GetIDDOCMonitoring';
import { CcmInvolvmentType } from 'types/graphql-global-types';

import IDDOCMonitoring from './index';

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
      query: GetIDDOCMonitoring,
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
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/ops-eval-and-learning/iddoc-monitoring'
        ]}
      >
        <MockedProvider mocks={iddocMonitoringMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/ops-eval-and-learning/iddoc-monitoring">
            <IDDOCMonitoring />
          </Route>
        </MockedProvider>
      </MemoryRouter>
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
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/ops-eval-and-learning/iddoc-monitoring'
        ]}
      >
        <MockedProvider mocks={iddocMonitoringMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/ops-eval-and-learning/iddoc-monitoring">
            <IDDOCMonitoring />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-file-naming-convention')
      ).toHaveValue('.pdf');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
