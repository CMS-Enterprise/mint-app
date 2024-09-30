import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  ClaimsBasedPayType,
  GetBeneficiaryCostSharingDocument,
  GetBeneficiaryCostSharingQuery,
  PayType
} from 'gql/generated/graphql';

import BeneficiaryCostSharing from './index';

type GetBeneficiaryCostSharingType = GetBeneficiaryCostSharingQuery['modelPlan']['payments'];

const mockData: GetBeneficiaryCostSharingType = {
  __typename: 'PlanPayments',
  id: '123',
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payClaims: [ClaimsBasedPayType.OTHER],
  beneficiaryCostSharingLevelAndHandling: 'This is a string',
  waiveBeneficiaryCostSharingForAnyServices: true,
  waiveBeneficiaryCostSharingServiceSpecification: null,
  waiverOnlyAppliesPartOfPayment: null,
  waiveBeneficiaryCostSharingNote: null
};

const paymentsMock = [
  {
    request: {
      query: GetBeneficiaryCostSharingDocument,
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/payment/beneficiary-cost-sharing'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/payment/beneficiary-cost-sharing">
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

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-beneficiary-cost-sharing')
      ).toHaveValue('This is a string');
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-waive-any-service-specification')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/payment/beneficiary-cost-sharing'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/payment/beneficiary-cost-sharing">
            <BeneficiaryCostSharing />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-beneficiary-cost-sharing')
      ).toHaveValue('This is a string');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
