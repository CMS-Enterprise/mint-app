import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CcmInvolvmentType,
  GetIddocTestingDocument,
  GetIddocTestingQuery
} from 'gql/generated/graphql';

import IDDOCTesting from './index';

type GetIDDOCTestingType =
  GetIddocTestingQuery['modelPlan']['opsEvalAndLearning'];

const iddocTestingMockData: GetIDDOCTestingType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION],
  dataNeededForMonitoring: [],
  iddocSupport: true,
  uatNeeds: '',
  stcNeeds: 'Yes needs',
  testingTimelines: '',
  testingNote: '',
  dataMonitoringFileTypes: [],
  dataMonitoringFileOther: '',
  dataResponseType: '',
  dataResponseFileFrequency: ''
};

const iddocTestingMock = [
  {
    request: {
      query: GetIddocTestingDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: iddocTestingMockData
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/iddoc-testing'
        ]}
      >
        <MockedProvider mocks={iddocTestingMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/iddoc-testing">
            <IDDOCTesting />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-iddoc-testing-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('ops-eval-and-learning-stc-needs')).toHaveValue(
        'Yes needs'
      );
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/iddoc-testing'
        ]}
      >
        <MockedProvider mocks={iddocTestingMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/iddoc-testing">
            <IDDOCTesting />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('ops-eval-and-learning-stc-needs')).toHaveValue(
        'Yes needs'
      );
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
