import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetInvolvementsDocument,
  GetInvolvementsQuery
} from 'gql/generated/graphql';
import { modelPlanBaseMock } from 'tests/mock/general';

import ModelInfoWrapper from 'contexts/ModelInfoContext';

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
  },
  ...modelPlanBaseMock
];

describe('Model Plan Characteristics', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/characteristics/involvements',
          element: (
            <ModelInfoWrapper>
              <Involvements />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/characteristics/involvements'
        ]
      }
    );

    render(
      <MockedProvider mocks={involvementsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
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
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/characteristics/involvements',
          element: (
            <ModelInfoWrapper>
              <Involvements />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/characteristics/involvements'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={involvementsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
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
