import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import GetITToolsPageFour from 'queries/ITTools/GetITToolsPageFour';
import {
  GetITToolPageFour_modelPlan_itTools as GetITToolsPageFourType,
  GetITToolPageFour_modelPlan_opsEvalAndLearning as OpsEvalAndLearningType
} from 'queries/ITTools/types/GetITToolPageFour';
import { OelHelpdeskSupportType } from 'types/graphql-global-types';
import { LockStatus } from 'views/SubscriptionHandler';

import ITToolsPageFour from '.';

const itToolsPageFourMockData: GetITToolsPageFourType = {
  __typename: 'PlanITTools',
  id: '',
  oelHelpdeskSupport: [OelHelpdeskSupportType.CONTRACTOR],
  oelHelpdeskSupportOther: '',
  oelHelpdeskSupportNote: '',
  oelManageAco: [],
  oelManageAcoOther: '',
  oelManageAcoNote: '',
  oelPerformanceBenchmark: [],
  oelPerformanceBenchmarkOther: '',
  oelPerformanceBenchmarkNote: ''
};

const opsEvalAndLearningMockData: OpsEvalAndLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '',
  helpdeskUse: true,
  iddocSupport: null,
  benchmarkForPerformance: null
};

const itToolsPageFourMock = [
  {
    request: {
      query: GetITToolsPageFour,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          itTools: itToolsPageFourMockData,
          opsEvalAndLearning: opsEvalAndLearningMockData
        }
      }
    }
  }
];

describe('IT Tools Page four', () => {
  it('renders without errors', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-four'
        ]}
      >
        <MockedProvider mocks={itToolsPageFourMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-four">
            <ITToolsPageFour opsEvalAndLearningLock={LockStatus.LOCKED} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('it-tools-page-four-form')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByTestId('tools-question-helpdeskUse')).toHaveTextContent(
        'Do you plan to use a helpdesk?'
      );

      expect(
        getByTestId('has-answered-tools-question-helpdeskUse')
      ).toHaveTextContent('You previously answered:');

      expect(getByTestId('tools-answers')).toHaveTextContent('Yes');

      expect(getByTestId('it-tools-oel-help-desk-CONTRACTOR')).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-four'
        ]}
      >
        <MockedProvider mocks={itToolsPageFourMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-four">
            <ITToolsPageFour opsEvalAndLearningLock={LockStatus.LOCKED} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('tools-question-helpdeskUse')).toHaveTextContent(
        'Do you plan to use a helpdesk?'
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
