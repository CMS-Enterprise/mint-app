import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { GetComplexityDocument, GetComplexityQuery } from 'gql/gen/graphql';

import {
  ClaimsBasedPayType,
  ComplexityCalculationLevelType,
  FrequencyType,
  PayType
} from 'types/graphql-global-types';

import ClaimsBasedPayment from './index';

type GetComplexityType = GetComplexityQuery['modelPlan']['payments'];

const mockData: GetComplexityType = {
  __typename: 'PlanPayments',
  id: '123',
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payClaims: [ClaimsBasedPayType.OTHER],
  expectedCalculationComplexityLevel: ComplexityCalculationLevelType.HIGH,
  expectedCalculationComplexityLevelNote: null,
  canParticipantsSelectBetweenPaymentMechanisms: true,
  canParticipantsSelectBetweenPaymentMechanismsHow: 'lorem ipsum',
  canParticipantsSelectBetweenPaymentMechanismsNote: null,
  anticipatedPaymentFrequency: [FrequencyType.ANNUALLY],
  anticipatedPaymentFrequencyOther: null,
  anticipatedPaymentFrequencyNote: null
};

const paymentsMock = [
  {
    request: {
      query: GetComplexityDocument,
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

describe('Model Plan -- Complexity', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment/complexity'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment/complexity">
            <ClaimsBasedPayment />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('payment-complexity-form')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('payment-multiple-payments-how')).toHaveValue(
        'lorem ipsum'
      );
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment/complexity'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment/complexity">
            <ClaimsBasedPayment />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('payment-complexity-form')).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
