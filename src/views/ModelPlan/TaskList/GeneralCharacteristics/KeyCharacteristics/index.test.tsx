import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetKeyCharacteristics from 'queries/GeneralCharacteristics/GetKeyCharacteristics';
import { GetKeyCharacteristics_modelPlan_generalCharacteristics as GetKeyCharacteristicsType } from 'queries/GeneralCharacteristics/types/GetKeyCharacteristics';
import { KeyCharacteristic } from 'types/graphql-global-types';

import KeyCharacteristics from './index';

const keyCharacteristicsMockData: GetKeyCharacteristicsType = {
  __typename: 'PlanGeneralCharacteristics',
  id: '123',
  alternativePaymentModel: false,
  alternativePaymentModelTypes: [],
  alternativePaymentModelNote: '',
  keyCharacteristics: [KeyCharacteristic.OTHER],
  keyCharacteristicsOther: 'Key other note',
  keyCharacteristicsNote: '',
  collectPlanBids: false,
  collectPlanBidsNote: '',
  managePartCDEnrollment: false,
  managePartCDEnrollmentNote: '',
  planContactUpdated: false,
  planContactUpdatedNote: ''
};

const keyCharacteristicsMock = [
  {
    request: {
      query: GetKeyCharacteristics,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          generalCharacteristics: keyCharacteristicsMockData
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/characteristics/key-characteristics'
        ]}
      >
        <MockedProvider mocks={keyCharacteristicsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/characteristics/key-characteristics">
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/characteristics/key-characteristics'
        ]}
      >
        <MockedProvider mocks={keyCharacteristicsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/characteristics/key-characteristics">
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
