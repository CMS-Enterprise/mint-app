import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import GetITToolsPageFive from 'queries/ITTools/GetITToolsPageFive';
import {
  GetITToolPageFive_modelPlan_itTools as GetITToolsPageFiveType,
  GetITToolPageFive_modelPlan_opsEvalAndLearning as OpsEvalAndLearningType
} from 'queries/ITTools/types/GetITToolPageFive';
import { OelProcessAppealsType } from 'types/graphql-global-types';

import ITToolsPageFive from '.';

const itToolsPageFiveMockData: GetITToolsPageFiveType = {
  __typename: 'PlanITTools',
  id: '',
  oelProcessAppeals: [OelProcessAppealsType.MEDICARE_APPEAL_SYSTEM],
  oelProcessAppealsOther: '',
  oelProcessAppealsNote: '',
  oelEvaluationContractor: [],
  oelEvaluationContractorOther: '',
  oelEvaluationContractorNote: '',
  oelCollectData: [],
  oelCollectDataOther: '',
  oelCollectDataNote: ''
};

const opsEvalAndLearningMockData: OpsEvalAndLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '',
  appealPerformance: true,
  appealFeedback: null,
  appealPayments: null,
  appealOther: null,
  evaluationApproaches: [],
  dataNeededForMonitoring: []
};

const itToolsPageFiveMock = [
  {
    request: {
      query: GetITToolsPageFive,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          itTools: itToolsPageFiveMockData,
          opsEvalAndLearning: opsEvalAndLearningMockData
        }
      }
    }
  }
];

describe('IT Tools Page five', () => {
  it('renders without errors', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-five'
        ]}
      >
        <MockedProvider mocks={itToolsPageFiveMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-five">
            <ITToolsPageFive />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('it-tools-page-five-form')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByTestId('tools-question-appealPerformance')).toHaveTextContent(
        'Participants will be able to appeal the following'
      );

      expect(
        getByTestId('has-answered-tools-question-appealPerformance')
      ).toHaveTextContent('You previously answered:');

      expect(getByTestId('tools-answers')).toHaveTextContent(
        'Performance Scores'
      );

      expect(
        getByTestId('it-tools-oel-process-appeals-MEDICARE_APPEAL_SYSTEM')
      ).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-five'
        ]}
      >
        <MockedProvider mocks={itToolsPageFiveMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-five">
            <ITToolsPageFive />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('tools-question-appealPerformance')).toHaveTextContent(
        'Participants will be able to appeal the following'
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
