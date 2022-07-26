import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetProviderOptions from 'queries/ParticipantsAndProviders/GetProviderOptions';
import { GetProviderOptions_modelPlan_participantsAndProviders as GetProviderOptionsType } from 'queries/ParticipantsAndProviders/types/GetProviderOptions';
import { ProviderAddType } from 'types/graphql-global-types';

import ProviderOptions from './index';

const providerOptionsMockData: GetProviderOptionsType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '123',
  providerAdditionFrequency: null,
  providerAdditionFrequencyOther: '',
  providerAdditionFrequencyNote: '',
  providerAddMethod: [ProviderAddType.OTHER],
  providerAddMethodOther: 'Competitive ball-room dancing, free for all',
  providerAddMethodNote: '',
  providerLeaveMethod: [],
  providerLeaveMethodOther: '',
  providerLeaveMethodNote: '',
  providerOverlap: null,
  providerOverlapHierarchy: '',
  providerOverlapNote: ''
};

const providerOptionsMock = [
  {
    request: {
      query: GetProviderOptions,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          participantsAndProviders: providerOptionsMockData
        }
      }
    }
  }
];

describe('Model Plan ProviderOptions', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/participants-and-providers/provider-options'
        ]}
      >
        <MockedProvider mocks={providerOptionsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/participants-and-providers/provider-options">
            <ProviderOptions />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-providers-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'participants-and-providers-provider-add-method-other'
        )
      ).toHaveValue('Competitive ball-room dancing, free for all');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/participants-and-providers/provider-options'
        ]}
      >
        <MockedProvider mocks={providerOptionsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/participants-and-providers/provider-options">
            <ProviderOptions />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'participants-and-providers-provider-add-method-other'
        )
      ).toHaveValue('Competitive ball-room dancing, free for all');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
