import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetRecover from 'queries/Payments/GetRecover';
import { GetRecover_modelPlan_payments as GetRecoverType } from 'queries/Payments/types/GetRecover';
import { ClaimsBasedPayType, PayType } from 'types/graphql-global-types';

import Recover from './index';

const mockData: GetRecoverType = {
  __typename: 'PlanPayments',
  id: '123',
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payClaims: [ClaimsBasedPayType.OTHER],
  willRecoverPayments: null,
  willRecoverPaymentsNote: 'string',
  anticipateReconcilingPaymentsRetrospectively: true,
  anticipateReconcilingPaymentsRetrospectivelyNote: 'string',
  paymentStartDate: null,
  paymentStartDateNote: 'string'
};

const paymentsMock = [
  {
    request: {
      query: GetRecover,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          payments: mockData
        }
      }
    }
  }
];

describe('Model Plan -- Recover', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment/recover-payment'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment/recover-payment">
            <Recover />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('payment-recover-form')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('payment-anticipate-reconciling-payment-retro-true')
      ).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment/recover-payment'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment/recover-payment">
            <Recover />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('payment-recover-form')).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
