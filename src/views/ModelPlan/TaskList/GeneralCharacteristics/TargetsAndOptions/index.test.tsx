import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetTargetsAndOptions from 'queries/GeneralCharacteristics/GetTargetsAndOptions';
import { GetTargetsAndOptions_modelPlan_generalCharacteristics as GetTargetsAndOptionsType } from 'queries/GeneralCharacteristics/types/GetTargetsAndOptions';
import { GeographyType } from 'types/graphql-global-types';

import TargetsAndOptions from './index';

const targetsAndOptionsMockData: GetTargetsAndOptionsType = {
  __typename: 'PlanGeneralCharacteristics',
  id: '123',
  geographiesTargeted: true,
  geographiesTargetedTypes: [GeographyType.OTHER],
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
      query: GetTargetsAndOptions,
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
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/characteristics/targets-and-options'
        ]}
      >
        <MockedProvider mocks={targetsAndOptionsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/characteristics/targets-and-options">
            <TargetsAndOptions />
          </Route>
        </MockedProvider>
      </MemoryRouter>
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
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/characteristics/targets-and-options'
        ]}
      >
        <MockedProvider mocks={targetsAndOptionsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/characteristics/targets-and-options">
            <TargetsAndOptions />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-geographies-targeted-other')
      ).toHaveValue('Other geography type');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
