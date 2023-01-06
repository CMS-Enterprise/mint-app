import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import GetITToolsPageSix from 'queries/ITTools/GetITToolsPageSix';
import {
  GetITToolPageSix_modelPlan_itTools as GetITToolsPageSixType,
  GetITToolPageSix_modelPlan_opsEvalAndLearning as OpsEvalAndLearningType
} from 'queries/ITTools/types/GetITToolPageSix';
import {
  DataForMonitoringType,
  OelObtainDataType
} from 'types/graphql-global-types';
import { LockStatus } from 'views/SubscriptionHandler';

import ITToolsPageSix from '.';

const itToolsPageSixMockData: GetITToolsPageSixType = {
  __typename: 'PlanITTools',
  id: '',
  oelObtainData: [OelObtainDataType.CCW],
  oelObtainDataOther: '',
  oelObtainDataNote: '',
  oelClaimsBasedMeasures: [],
  oelClaimsBasedMeasuresOther: '',
  oelClaimsBasedMeasuresNote: '',
  oelQualityScores: [],
  oelQualityScoresOther: '',
  oelQualityScoresNote: ''
};

const opsEvalAndLearningMockData: OpsEvalAndLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '',
  dataNeededForMonitoring: [DataForMonitoringType.CLINICAL_DATA]
};

const itToolsPageSixMock = [
  {
    request: {
      query: GetITToolsPageSix,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          itTools: itToolsPageSixMockData,
          opsEvalAndLearning: opsEvalAndLearningMockData
        }
      }
    }
  }
];

describe('IT Tools Page six', () => {
  it('renders without errors', async () => {
    const { getByTestId, getAllByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-six'
        ]}
      >
        <MockedProvider mocks={itToolsPageSixMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-six">
            <ITToolsPageSix opsEvalAndLearningLock={LockStatus.LOCKED} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('it-tools-page-six-form')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        getAllByTestId('tools-question-dataNeededForMonitoring')[0]
      ).toHaveTextContent('What data do you need to monitor the model?');

      expect(
        getAllByTestId('has-answered-tools-question-dataNeededForMonitoring')[0]
      ).toHaveTextContent('You previously answered:');

      expect(getAllByTestId('tools-answers')[0]).toHaveTextContent(
        'Clinical data'
      );

      expect(getByTestId('it-tools-oel-obtain-data-CCW')).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getAllByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-six'
        ]}
      >
        <MockedProvider mocks={itToolsPageSixMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-six">
            <ITToolsPageSix opsEvalAndLearningLock={LockStatus.LOCKED} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getAllByTestId('tools-question-dataNeededForMonitoring')[0]
      ).toHaveTextContent('What data do you need to monitor the model?');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
