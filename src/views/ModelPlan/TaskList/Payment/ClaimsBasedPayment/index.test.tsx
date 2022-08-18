import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetClaimsBasedPayment from 'queries/Payments/GetClaimsBasedPayment';
import { GetClaimsBasedPayment_modelPlan_payments as GetClaimsBasedPaymentType } from 'queries/Payments/types/GetClaimsBasedPayment';
import {
  ClaimsBasedPayType,
  PayType,
  TaskStatus
} from 'types/graphql-global-types';

import ClaimsBasedPayment from './index';

const mockData: GetClaimsBasedPaymentType = {
  __typename: 'PlanPayments',
  id: '123',
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payClaims: [ClaimsBasedPayType.OTHER],
  payClaimsNote: '',
  payClaimsOther: 'pay claims other',
  shouldAnyProvidersExcludedFFSSystems: null,
  shouldAnyProviderExcludedFFSSystemsNote: '',
  changesMedicarePhysicianFeeSchedule: null,
  changesMedicarePhysicianFeeScheduleNote: '',
  affectsMedicareSecondaryPayerClaims: null,
  affectsMedicareSecondaryPayerClaimsHow: '',
  affectsMedicareSecondaryPayerClaimsNote: '',
  payModelDifferentiation: ''
};

const paymentsMock = [
  {
    request: {
      query: GetClaimsBasedPayment,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          payments: mockData,
          itTools: {
            status: TaskStatus.IN_PROGRESS
          }
        }
      }
    }
  }
];

describe('Model Plan -- Claims Based Payment', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment/claims-based-payment'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment/claims-based-payment">
            <ClaimsBasedPayment />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-claims-based-payment-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('payment-pay-claims-other')).toHaveValue(
        'pay claims other'
      );
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment/claims-based-payment'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment/claims-based-payment">
            <ClaimsBasedPayment />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-claims-based-payment-form')
      ).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
