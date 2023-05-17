import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetIDDOC from 'queries/OpsEvalAndLearning/GetIDDOC';
import { GetIDDOC_modelPlan_opsEvalAndLearning as GetIDDOCType } from 'queries/OpsEvalAndLearning/types/GetIDDOC';
import { CcmInvolvmentType } from 'types/graphql-global-types';

import IDDOC from './index';

const iddocMockData: GetIDDOCType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION],
  dataNeededForMonitoring: [],
  iddocSupport: true,
  technicalContactsIdentified: null,
  technicalContactsIdentifiedDetail: '',
  technicalContactsIdentifiedNote: '',
  captureParticipantInfo: null,
  captureParticipantInfoNote: '',
  icdOwner: 'John Doe',
  draftIcdDueDate: null,
  icdNote: ''
};

const iddocMock = [
  {
    request: {
      query: GetIDDOC,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: iddocMockData
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/ops-eval-and-learning/iddoc'
        ]}
      >
        <MockedProvider mocks={iddocMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/ops-eval-and-learning/iddoc">
            <IDDOC />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-iddoc-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-capture-icd-owner')
      ).toHaveValue('John Doe');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/ops-eval-and-learning/iddoc'
        ]}
      >
        <MockedProvider mocks={iddocMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/ops-eval-and-learning/iddoc">
            <IDDOC />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-capture-icd-owner')
      ).toHaveValue('John Doe');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
