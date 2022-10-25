import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import GetITToolsPageTwo from 'queries/ITTools/GetITToolsPageTwo';
import {
  GetITToolPageTwo_modelPlan_itTools as GetITToolsPageTwoType,
  GetITToolPageTwo_modelPlan_participantsAndProviders as ParticipantsAndProvidersType
} from 'queries/ITTools/types/GetITToolPageTwo';
import { PpToAdvertiseType, RecruitmentType } from 'types/graphql-global-types';
import { LockStatus } from 'views/SubscriptionHandler';

import ITToolsPageTwo from '.';

const itToolsPageTwoMockData: GetITToolsPageTwoType = {
  __typename: 'PlanITTools',
  id: '',
  ppToAdvertise: [PpToAdvertiseType.GRANT_SOLUTIONS],
  ppToAdvertiseOther: '',
  ppToAdvertiseNote: '',
  ppCollectScoreReview: [],
  ppCollectScoreReviewOther: '',
  ppCollectScoreReviewNote: '',
  ppAppSupportContractor: [],
  ppAppSupportContractorOther: '',
  ppAppSupportContractorNote: ''
};

const participantsAndProvidersMockData: ParticipantsAndProvidersType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '',
  selectionMethod: [],
  recruitmentMethod: RecruitmentType.LOI
};

const itToolsPageTwoMock = [
  {
    request: {
      query: GetITToolsPageTwo,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          itTools: itToolsPageTwoMockData,
          participantsAndProviders: participantsAndProvidersMockData
        }
      }
    }
  }
];

describe('IT Tools Page two', () => {
  it('renders without errors', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-two'
        ]}
      >
        <MockedProvider mocks={itToolsPageTwoMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-two">
            <ITToolsPageTwo participantsAndProvidersLock={LockStatus.LOCKED} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('it-tools-page-two-form')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByTestId('tools-question-recruitmentMethod')).toHaveTextContent(
        'How will you recruit the participants?'
      );

      expect(
        getByTestId('has-answered-tools-question-recruitmentMethod')
      ).toHaveTextContent('You previously answered:');

      expect(getByTestId('tools-answers')).toHaveTextContent(
        'LOI (Letter of interest)'
      );

      expect(
        getByTestId('it-tools-pp-to-advertise-GRANT_SOLUTIONS')
      ).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-two'
        ]}
      >
        <MockedProvider mocks={itToolsPageTwoMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-two">
            <ITToolsPageTwo participantsAndProvidersLock={LockStatus.LOCKED} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('tools-question-recruitmentMethod')).toHaveTextContent(
        'How will you recruit the participants?'
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
