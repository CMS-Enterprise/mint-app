import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { GetInvolvementsDocument, GetInvolvementsQuery } from 'gql/gen/graphql';

import Involvements from './index';

type GetInvolvementsType =
  GetInvolvementsQuery['modelPlan']['generalCharacteristics'];

const involvementsMockData: GetInvolvementsType = {
  __typename: 'PlanGeneralCharacteristics',
  id: '123',
  careCoordinationInvolved: false,
  careCoordinationInvolvedDescription: '',
  careCoordinationInvolvedNote: '',
  additionalServicesInvolved: true,
  additionalServicesInvolvedDescription: 'Lots of additional services',
  additionalServicesInvolvedNote: '',
  communityPartnersInvolved: false,
  communityPartnersInvolvedDescription: '',
  communityPartnersInvolvedNote: ''
};

const involvementsMock = [
  {
    request: {
      query: GetInvolvementsDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          generalCharacteristics: involvementsMockData
        }
      }
    }
  }
];

describe('Model Plan Characteristics', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/characteristics/involvements'
        ]}
      >
        <MockedProvider mocks={involvementsMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/characteristics/involvements">
            <Involvements />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-involvements-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'plan-characteristics-additional-services-description'
        )
      ).toHaveValue('Lots of additional services');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/characteristics/involvements'
        ]}
      >
        <MockedProvider mocks={involvementsMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/characteristics/involvements">
            <Involvements />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'plan-characteristics-additional-services-description'
        )
      ).toHaveValue('Lots of additional services');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
