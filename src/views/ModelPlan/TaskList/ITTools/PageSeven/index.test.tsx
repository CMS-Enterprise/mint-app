import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import GetITToolsPageSeven from 'queries/ITTools/GetITToolsPageSeven';
import {
  GetITToolPageSeven_modelPlan_itTools as GetITToolsPageSevenType,
  GetITToolPageSeven_modelPlan_opsEvalAndLearning as OpsEvalAndLearningType
} from 'queries/ITTools/types/GetITToolPageSeven';
import {
  DataToSendParticipantsType,
  OelSendReportsType
} from 'types/graphql-global-types';
import { LockStatus } from 'views/SubscriptionHandler';

import ITToolsPageSeven from '.';

const itToolsPageSevenMockData: GetITToolsPageSevenType = {
  __typename: 'PlanITTools',
  id: '',
  oelSendReports: [OelSendReportsType.IDOS],
  oelSendReportsOther: '',
  oelSendReportsNote: '',
  oelLearningContractor: [],
  oelLearningContractorOther: '',
  oelLearningContractorNote: '',
  oelParticipantCollaboration: [],
  oelParticipantCollaborationOther: '',
  oelParticipantCollaborationNote: ''
};

const opsEvalAndLearningMockData: OpsEvalAndLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '',
  dataToSendParticicipants: [
    DataToSendParticipantsType.BASELINE_HISTORICAL_DATA
  ],
  modelLearningSystems: []
};

const itToolsPageSevenMock = [
  {
    request: {
      query: GetITToolsPageSeven,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          itTools: itToolsPageSevenMockData,
          opsEvalAndLearning: opsEvalAndLearningMockData
        }
      }
    }
  }
];

describe('IT Tools Page seven', () => {
  it('renders without errors', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-seven'
        ]}
      >
        <MockedProvider mocks={itToolsPageSevenMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-seven">
            <ITToolsPageSeven opsEvalAndLearningLock={LockStatus.LOCKED} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('it-tools-page-seven-form')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        getByTestId('tools-question-dataToSendParticicipants')
      ).toHaveTextContent('What data will you send to participants?');

      expect(
        getByTestId('has-answered-tools-question-dataToSendParticicipants')
      ).toHaveTextContent('You previously answered:');

      expect(getByTestId('tools-answers')).toHaveTextContent(
        'Baseline/historical data'
      );

      expect(getByTestId('it-tools-oel-send-reports-IDOS')).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-seven'
        ]}
      >
        <MockedProvider mocks={itToolsPageSevenMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-seven">
            <ITToolsPageSeven opsEvalAndLearningLock={LockStatus.LOCKED} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByTestId('tools-question-dataToSendParticicipants')
      ).toHaveTextContent('What data will you send to participants?');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
