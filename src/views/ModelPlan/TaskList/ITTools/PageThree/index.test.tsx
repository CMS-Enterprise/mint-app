import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import GetITToolsPageThree from 'queries/ITTools/GetITToolsPageThree';
import {
  GetITToolPageThree_modelPlan_itTools as GetITToolsPageThreeType,
  GetITToolPageThree_modelPlan_participantsAndProviders as ParticipantsAndProvidersType
} from 'queries/ITTools/types/GetITToolPageThree';
import {
  ParticipantCommunicationType,
  PpCommunicateWithParticipantType
} from 'types/graphql-global-types';
import { LockStatus } from 'views/SubscriptionHandler';

import ITToolsPageThree from '.';

const itToolsPageThreeMockData: GetITToolsPageThreeType = {
  __typename: 'PlanITTools',
  id: '',
  ppCommunicateWithParticipant: [
    PpCommunicateWithParticipantType.SALESFORCE_PORTAL
  ],
  ppCommunicateWithParticipantOther: '',
  ppCommunicateWithParticipantNote: '',
  ppManageProviderOverlap: [],
  ppManageProviderOverlapOther: '',
  ppManageProviderOverlapNote: '',
  bManageBeneficiaryOverlap: [],
  bManageBeneficiaryOverlapOther: '',
  bManageBeneficiaryOverlapNote: ''
};

const participantsAndProvidersMockData: ParticipantsAndProvidersType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '',
  communicationMethod: [ParticipantCommunicationType.MASS_EMAIL]
};

const itToolsPageThreeMock = [
  {
    request: {
      query: GetITToolsPageThree,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          itTools: itToolsPageThreeMockData,
          participantsAndProviders: participantsAndProvidersMockData
        }
      }
    }
  }
];

describe('IT Tools Page three', () => {
  it('renders without errors', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-three'
        ]}
      >
        <MockedProvider mocks={itToolsPageThreeMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-three">
            <ITToolsPageThree
              participantsAndProvidersLock={LockStatus.LOCKED}
            />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('it-tools-page-three-form')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        getByTestId('tools-question-communicationMethod')
      ).toHaveTextContent('How will you communicate with participants?');

      expect(
        getByTestId('has-answered-tools-question-communicationMethod')
      ).toHaveTextContent('You previously answered:');

      expect(getByTestId('tools-answers')).toHaveTextContent(
        'Send mass emails to new participants'
      );

      expect(
        getByTestId(
          'it-tools-pp-communicate-with-participant-SALESFORCE_PORTAL'
        )
      ).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-three'
        ]}
      >
        <MockedProvider mocks={itToolsPageThreeMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-three">
            <ITToolsPageThree
              participantsAndProvidersLock={LockStatus.LOCKED}
            />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByTestId('tools-question-communicationMethod')
      ).toHaveTextContent('How will you communicate with participants?');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
