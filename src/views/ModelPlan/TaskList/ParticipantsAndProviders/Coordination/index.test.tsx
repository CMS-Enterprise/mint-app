import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetCoordination from 'queries/ParticipantsAndProviders/GetCoordination';
import { GetCoordination_modelPlan_participantsAndProviders as GetCoordinationType } from 'queries/ParticipantsAndProviders/types/GetCoordination';
import { ParticipantsIDType } from 'types/graphql-global-types';

import Coordination from './index';

const coordinationMockData: GetCoordinationType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '123',
  coordinateWork: null,
  coordinateWorkNote: '',
  gainsharePayments: null,
  gainsharePaymentsTrack: null,
  gainsharePaymentsNote: '',
  participantsIds: [ParticipantsIDType.OTHER],
  participantsIdsOther: 'Candy Kingdom Operations Number',
  participantsIDSNote: ''
};

const coordinationMock = [
  {
    request: {
      query: GetCoordination,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          operationalNeeds: [
            {
              id: '780c990e-91f5-48a2-869a-59420940a533',
              modifiedDts: '2024-05-12T15:01:39.190679Z',
              __typename: 'OperationalNeed'
            }
          ],
          participantsAndProviders: coordinationMockData
        }
      }
    }
  }
];

describe('Model Plan Coordination', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/participants-and-providers/coordination'
        ]}
      >
        <MockedProvider mocks={coordinationMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/participants-and-providers/coordination">
            <Coordination />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-coordination-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-participant-id-other')
      ).toHaveValue('Candy Kingdom Operations Number');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/participants-and-providers/coordination'
        ]}
      >
        <MockedProvider mocks={coordinationMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/participants-and-providers/coordination">
            <Coordination />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-participant-id-other')
      ).toHaveValue('Candy Kingdom Operations Number');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
