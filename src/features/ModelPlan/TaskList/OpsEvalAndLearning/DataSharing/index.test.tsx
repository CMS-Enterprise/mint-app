import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CcmInvolvmentType,
  DataStartsType,
  FrequencyType,
  GetDataSharingDocument,
  GetDataSharingQuery
} from 'gql/generated/graphql';

import DataSharing from '.';

type GetDataSharingType =
  GetDataSharingQuery['modelPlan']['opsEvalAndLearning'];

const dataSharingMockData: GetDataSharingType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION],
  dataNeededForMonitoring: [],
  iddocSupport: true,
  dataSharingStarts: null,
  dataSharingStartsOther: '',
  dataSharingFrequency: [],
  dataSharingFrequencyContinually: '',
  dataSharingFrequencyOther: '',
  dataSharingStartsNote: '',
  dataCollectionStarts: null,
  dataCollectionStartsOther: '',
  dataCollectionFrequency: [],
  dataCollectionFrequencyContinually: '',
  dataCollectionFrequencyOther: '',
  dataCollectionFrequencyNote: '',
  qualityReportingStarts: DataStartsType.OTHER,
  qualityReportingStartsOther: 'Other Value',
  qualityReportingStartsNote: '',
  qualityReportingFrequency: [FrequencyType.CONTINUALLY],
  qualityReportingFrequencyContinually: 'continual frequency',
  qualityReportingFrequencyOther: ''
};

const dataSharingMock = [
  {
    request: {
      query: GetDataSharingDocument,
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/data-sharing'
        ]}
      >
        <MockedProvider mocks={dataSharingMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/data-sharing">
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/data-sharing'
        ]}
      >
        <MockedProvider mocks={dataSharingMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/data-sharing">
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
