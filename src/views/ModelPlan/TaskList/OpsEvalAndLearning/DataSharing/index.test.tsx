import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetDataSharing from 'queries/OpsEvalAndLearning/GetDataSharing';
import { GetDataSharing_modelPlan_opsEvalAndLearning as GetDataSharingType } from 'queries/OpsEvalAndLearning/types/GetDataSharing';
import { CcmInvolvmentType, DataStartsType } from 'types/graphql-global-types';

import DataSharing from '.';

const dataSharingMockData: GetDataSharingType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION],
  dataNeededForMonitoring: [],
  iddocSupport: true,
  dataSharingStarts: null,
  dataSharingStartsOther: '',
  dataSharingFrequency: [],
  dataSharingFrequencyOther: '',
  dataSharingStartsNote: '',
  dataCollectionStarts: null,
  dataCollectionStartsOther: '',
  dataCollectionFrequency: [],
  dataCollectionFrequencyOther: '',
  dataCollectionFrequencyNote: '',
  qualityReportingStarts: DataStartsType.OTHER,
  qualityReportingStartsOther: 'Other Value',
  qualityReportingStartsNote: ''
};

const dataSharingMock = [
  {
    request: {
      query: GetDataSharing,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: dataSharingMockData
        }
      }
    }
  }
];

describe('Model Plan Ops Eval and Learning Data Sharing', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/ops-eval-and-learning/data-sharing'
        ]}
      >
        <MockedProvider mocks={dataSharingMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/ops-eval-and-learning/data-sharing">
            <DataSharing />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-data-sharing-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-data-reporting-starts-other')
      ).toHaveValue('Other Value');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/ops-eval-and-learning/data-sharing'
        ]}
      >
        <MockedProvider mocks={dataSharingMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/ops-eval-and-learning/data-sharing">
            <DataSharing />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-data-reporting-starts-other')
      ).toHaveValue('Other Value');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
