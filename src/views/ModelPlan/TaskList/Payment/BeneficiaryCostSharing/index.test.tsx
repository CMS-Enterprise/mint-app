import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetBeneficiaryCostSharing from 'queries/Payments/GetBeneficiaryCostSharing';
import { GetBeneficiaryCostSharing_modelPlan_payments as GetBeneficiaryCostSharingType } from 'queries/Payments/types/GetBeneficiaryCostSharing';
import { ClaimsBasedPayType, PayType } from 'types/graphql-global-types';

import BeneficiaryCostSharing from './index';

const mockData: GetBeneficiaryCostSharingType = {
  __typename: 'PlanPayments',
  id: '123',
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payClaims: [ClaimsBasedPayType.OTHER],
  beneficiaryCostSharingLevelAndHandling: null,
  waiveBeneficiaryCostSharingForAnyServices: null,
  waiveBeneficiaryCostSharingServiceSpecification: null,
  waiverOnlyAppliesPartOfPayment: null,
  waiveBeneficiaryCostSharingNote: null
};

const paymentsMock = [
  {
    request: {
      query: GetBeneficiaryCostSharing,
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

describe('Model Plan -- BeneficiaryCostSharing', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment/beneficiary-cost-sharing'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment/beneficiary-cost-sharing">
            <BeneficiaryCostSharing />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-beneficiary-cost-sharing-form')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment/beneficiary-cost-sharing'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment/beneficiary-cost-sharing">
            <BeneficiaryCostSharing />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
