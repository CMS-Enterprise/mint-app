import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetModelPlanCollaborators from 'queries/Collaborators/GetModelCollaborators';

import Collaborators from './index';

describe('Collaborator/Team Member page w/table', () => {
  const mocks = [
    {
      request: {
        query: GetModelPlanCollaborators,
        variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
      },
      result: {
        data: {
          modelPlan: {
            collaborators: [
              {
                id: '61c7b30c-969d-4dd4-b13b-a5065f43be43',
                modelPlanID: 'f11eb129-2c80-4080-9440-439cbe1a286f',
                euaUserID: 'ABCD',
                email: 'jdoe@gmail.com',
                fullName: 'John Doe',
                teamRole: 'MODEL_LEAD',
                createdDts: '2022-10-22T00:00:00Z'
              }
            ]
          }
        }
      }
    }
  ];
  it('displays a table with collaborator', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          'models/new-plan/f11eb129-2c80-4080-9440-439cbe1a286f/collaborators'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="models/new-plan/:modelID/collaborators">
            <Collaborators />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('table')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Model Lead')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          'models/new-plan/f11eb129-2c80-4080-9440-439cbe1a286f/collaborators'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="models/new-plan/:modelID/collaborators">
            <Collaborators />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
