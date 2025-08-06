import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GeographyType,
  GetTargetsAndOptionsDocument,
  GetTargetsAndOptionsQuery
} from 'gql/generated/graphql';

import TargetsAndOptions from './index';

type GetTargetsAndOptionsType =
  GetTargetsAndOptionsQuery['modelPlan']['generalCharacteristics'];

const targetsAndOptionsMockData: GetTargetsAndOptionsType = {
  __typename: 'PlanGeneralCharacteristics',
  id: '123',
  geographiesTargeted: true,
  geographiesTargetedTypes: [GeographyType.OTHER],
  geographiesStatesAndTerritories: [],
  geographiesRegionTypes: [],
  geographiesTargetedTypesOther: 'Other geography type',
  geographiesTargetedAppliedTo: [],
  geographiesTargetedAppliedToOther: '',
  geographiesTargetedNote: '',
  participationOptions: false,
  participationOptionsNote: '',
  agreementTypes: [],
  agreementTypesOther: '',
  multiplePatricipationAgreementsNeeded: false,
  multiplePatricipationAgreementsNeededNote: ''
};

const targetsAndOptionsMock = [
  {
    request: {
      query: GetTargetsAndOptionsDocument,
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
          generalCharacteristics: targetsAndOptionsMockData
        }
      }
    }
  }
];

describe('Model Plan Characteristics', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/characteristics/targets-and-options',
          element: <TargetsAndOptions />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/characteristics/targets-and-options'
        ]
      }
    );

    render(
      <MockedProvider mocks={targetsAndOptionsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-targets-and-options-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-geographies-targeted-other')
      ).toHaveValue('Other geography type');
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/characteristics/targets-and-options',
          element: <TargetsAndOptions />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/characteristics/targets-and-options'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={targetsAndOptionsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-geographies-targeted-other')
      ).toHaveValue('Other geography type');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
