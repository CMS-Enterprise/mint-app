import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetParticipantOptionsDocument,
  GetParticipantOptionsQuery
} from 'gql/gen/graphql';

import ParticipantOptions from './index';

type GetParticipantOptionsType =
  GetParticipantOptionsQuery['modelPlan']['participantsAndProviders'];

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
      query: GetParticipantOptionsDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          participantsAndProviders: participantOptionsMockData,
          operationalNeeds: [
            {
              __typename: 'OperationalNeed',
              id: '424213',
              modifiedDts: null
            }
          ]
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers/participants-options'
        ]}
      >
        <MockedProvider mocks={participantOptionsMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/participants-and-providers/participants-options">
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/participants-and-providers/participants-options'
        ]}
      >
        <MockedProvider mocks={participantOptionsMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/participants-and-providers/participants-options">
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
