import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetParticipantsAndProvidersDocument,
  GetParticipantsAndProvidersQuery,
  ParticipantsType
} from 'gql/gen/graphql';

import { ParticipantsAndProvidersContent } from './index';

type GetParticipantsAndProvidersType = GetParticipantsAndProvidersQuery['modelPlan']['participantsAndProviders'];

const participantsAndProvidersMockData: GetParticipantsAndProvidersType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '123',
  participants: [
    ParticipantsType.MEDICARE_PROVIDERS,
    ParticipantsType.STATES,
    ParticipantsType.OTHER
  ],
  medicareProviderType: 'Oncology Providers',
  statesEngagement:
    'States will determine administration specific to the state',
  participantsOther: 'The candy people',
  participantsNote: '',
  participantsCurrentlyInModels: null,
  participantsCurrentlyInModelsNote: '',
  modelApplicationLevel: 'c92.00 and c92.01'
};

const participantsAndProvidersMock = [
  {
    request: {
      query: GetParticipantsAndProvidersDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          participantsAndProviders: participantsAndProvidersMockData
        }
      }
    }
  }
];

describe('Model Plan Participants and Providers', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers'
        ]}
      >
        <MockedProvider
          mocks={participantsAndProvidersMock}
          addTypename={false}
        >
          <Route path="/models/:modelID/collaboration-area/task-list/participants-and-providers">
            <ParticipantsAndProvidersContent />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-medicare-type')
      ).toHaveValue('Oncology Providers');

      expect(
        screen.getByTestId('participants-and-providers-states-engagement')
      ).toHaveValue(
        'States will determine administration specific to the state'
      );

      expect(
        screen.getByTestId('participants-and-providers-participants-other')
      ).toHaveValue('The candy people');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers'
        ]}
      >
        <MockedProvider
          mocks={participantsAndProvidersMock}
          addTypename={false}
        >
          <Route path="/models/:modelID/collaboration-area/task-list/participants-and-providers">
            <ParticipantsAndProvidersContent />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-medicare-type')
      ).toHaveValue('Oncology Providers');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
