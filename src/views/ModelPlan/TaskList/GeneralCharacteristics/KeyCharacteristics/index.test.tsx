import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetKeyCharacteristicsDocument,
  GetKeyCharacteristicsQuery,
  KeyCharacteristic
} from 'gql/gen/graphql';

import KeyCharacteristics from './index';

type GetKeyCharacteristicsType = GetKeyCharacteristicsQuery['modelPlan']['generalCharacteristics'];

const keyCharacteristicsMockData: GetKeyCharacteristicsType = {
  __typename: 'PlanGeneralCharacteristics',
  id: '123',
  agencyOrStateHelp: [],
  agencyOrStateHelpOther: '',
  agencyOrStateHelpNote: '',
  alternativePaymentModelTypes: [],
  alternativePaymentModelNote: '',
  keyCharacteristics: [KeyCharacteristic.OTHER],
  keyCharacteristicsOther: 'Key other note',
  keyCharacteristicsNote: '',
  collectPlanBids: false,
  collectPlanBidsNote: '',
  managePartCDEnrollment: false,
  managePartCDEnrollmentNote: '',
  planContractUpdated: false,
  planContractUpdatedNote: ''
};

const keyCharacteristicsMock = [
  {
    request: {
      query: GetKeyCharacteristicsDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          generalCharacteristics: keyCharacteristicsMockData,
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

describe('Model Plan Characteristics', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/characteristics/key-characteristics'
        ]}
      >
        <MockedProvider mocks={keyCharacteristicsMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/characteristics/key-characteristics">
            <KeyCharacteristics />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-key-characteristics-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('plan-characteristics-key-other')).toHaveValue(
        'Key other note'
      );
    });

    expect(
      screen.getByText('Selected key characteristics')
    ).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/characteristics/key-characteristics'
        ]}
      >
        <MockedProvider mocks={keyCharacteristicsMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/characteristics/key-characteristics">
            <KeyCharacteristics />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('plan-characteristics-key-other')).toHaveValue(
        'Key other note'
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
