import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetCommunicationDocument,
  GetCommunicationQuery,
  ParticipantRiskType
} from 'gql/gen/graphql';

import Communication from './index';

type GetCommunicationType = GetCommunicationQuery['modelPlan']['participantsAndProviders'];

const communicationMockData: GetCommunicationType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '123',
  communicationMethod: [],
  communicationMethodOther: '',
  communicationNote: '',
  riskType: ParticipantRiskType.OTHER,
  riskOther: 'Programmatic Risk',
  riskNote: '',
  willRiskChange: null,
  willRiskChangeNote: ''
};

const communicationMock = [
  {
    request: {
      query: GetCommunicationDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          participantsAndProviders: communicationMockData,
          operationalNeeds: [
            {
              modifiedDts: ''
            }
          ]
        }
      }
    }
  }
];

describe('Model Plan Communication', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/participants-and-providers/communication'
        ]}
      >
        <MockedProvider mocks={communicationMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/participants-and-providers/communication">
            <Communication />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-communication-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-risk-type-other')
      ).toHaveValue('Programmatic Risk');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/participants-and-providers/communication'
        ]}
      >
        <MockedProvider mocks={communicationMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/participants-and-providers/communication">
            <Communication />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-risk-type-other')
      ).toHaveValue('Programmatic Risk');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
