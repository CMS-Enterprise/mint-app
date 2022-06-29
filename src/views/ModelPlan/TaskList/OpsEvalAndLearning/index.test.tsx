import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetOpsEvalAndLearning from 'queries/OpsEvalAndLearning/GetOpsEvalAndLearning';
import { GetOpsEvalAndLearning_modelPlan_opsEvalAndLearning as GetOpsEvalAndLearningType } from 'queries/OpsEvalAndLearning/types/GetOpsEvalAndLearning';

import { OpsEvalAndLearningContent } from './index';

const opsEvalAndLearningMockData: GetOpsEvalAndLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [],
  agencyOrStateHelp: [],
  agencyOrStateHelpOther: '',
  agencyOrStateHelpNote: '',
  stakeholders: [],
  stakeholdersOther: '',
  stakeholdersNote: '',
  helpdeskUse: null,
  helpdeskUseNote: '',
  contractorSupport: [],
  contractorSupportOther: '',
  contractorSupportHow: 'Differ text',
  contractorSupportNote: '',
  iddocSupport: null,
  iddocSupportNote: ''
};

const opsEvalAndLearningMock = [
  {
    request: {
      query: GetOpsEvalAndLearning,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: opsEvalAndLearningMockData
        }
      }
    }
  }
];

describe('Model Plan Ops Eval and Learning', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/ops-eval-and-learning'
        ]}
      >
        <MockedProvider mocks={opsEvalAndLearningMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/ops-eval-and-learning">
            <OpsEvalAndLearningContent />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-contractor-support-how')
      ).toHaveValue('Differ text');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/ops-eval-and-learning'
        ]}
      >
        <MockedProvider mocks={opsEvalAndLearningMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/ops-eval-and-learning">
            <OpsEvalAndLearningContent />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-contractor-support-how')
      ).toHaveValue('Differ text');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
