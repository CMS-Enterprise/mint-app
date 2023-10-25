import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetNonClaimsBasedPayment from 'queries/Payments/GetNonClaimsBasedPayment';
import { GetNonClaimsBasedPayment_modelPlan_payments as GetNonClaimsBasedPaymentType } from 'queries/Payments/types/GetNonClaimsBasedPayment';
import {
  ClaimsBasedPayType,
  NonClaimsBasedPayType,
  PayType
} from 'types/graphql-global-types';

import NonClaimsBasedPayment from './index';

const mockData: GetNonClaimsBasedPaymentType = {
  __typename: 'PlanPayments',
  id: '123',
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payClaims: [ClaimsBasedPayType.OTHER],
  nonClaimsPayments: [NonClaimsBasedPayType.OTHER],
  nonClaimsPaymentsNote: '',
  nonClaimsPaymentOther: 'Lorem Ipsum',
  paymentCalculationOwner: null,
  numberPaymentsPerPayCycle: null,
  numberPaymentsPerPayCycleNote: null,
  sharedSystemsInvolvedAdditionalClaimPayment: null,
  sharedSystemsInvolvedAdditionalClaimPaymentNote: null,
  planningToUseInnovationPaymentContractor: null,
  planningToUseInnovationPaymentContractorNote: null
};

const paymentsMock = [
  {
    request: {
      query: GetNonClaimsBasedPayment,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          payments: mockData,
          operationalNeeds: [
            {
              modifiedDts: ''
            }
          ]
        }
      }
    }
  }
];

describe('Model Plan -- NonClaimsBasedPayment', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment/non-claims-based-payment'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment/non-claims-based-payment">
            <NonClaimsBasedPayment />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-non-claims-based-payment-form')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment/non-claims-based-payment'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment/non-claims-based-payment">
            <NonClaimsBasedPayment />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-non-claims-based-payment-form')
      ).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
