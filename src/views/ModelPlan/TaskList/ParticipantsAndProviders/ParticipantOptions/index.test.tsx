import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetParticipantOptions from 'queries/ParticipantsAndProviders/GetParticipantOptions';
import { GetParticipantOptions_modelPlan_participantsAndProviders as GetParticipantOptionsType } from 'queries/ParticipantsAndProviders/types/GetParticipantOptions';

import ParticipantOptions from './index';

const participantOptionsMockData: GetParticipantOptionsType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '123',
  expectedNumberOfParticipants: 350,
  estimateConfidence: null,
  confidenceNote: '',
  recruitmentMethod: null,
  recruitmentOther: '',
  recruitmentNote: '',
  selectionMethod: [],
  selectionOther: '',
  selectionNote: ''
};

const participantOptionsMock = [
  {
    request: {
      query: GetParticipantOptions,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          participantsAndProviders: participantOptionsMockData
        }
      }
    }
  }
];

describe('Model Plan ParticipantsOptions', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/participants-and-providers/participants-options'
        ]}
      >
        <MockedProvider mocks={participantOptionsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/participants-and-providers/participants-options">
            <ParticipantOptions />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-options-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-expected-participants')
      ).toHaveValue('350');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/participants-and-providers/participants-options'
        ]}
      >
        <MockedProvider mocks={participantOptionsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/participants-and-providers/participants-options">
            <ParticipantOptions />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-expected-participants')
      ).toHaveValue('350');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
