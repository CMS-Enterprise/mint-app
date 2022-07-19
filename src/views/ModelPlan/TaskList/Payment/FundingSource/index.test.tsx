import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetFunding from 'queries/Payments/GetFunding';
import { GetFunding_modelPlan_payments as GetFundingType } from 'queries/Payments/types/GetFunding';
import {
  ClaimsBasedPayType,
  FundingSource as FundingSourceType,
  PayRecipient,
  PayType
} from 'types/graphql-global-types';

import FundingSource from './index';

const mockData: GetFundingType = {
  __typename: 'PlanPayments',
  id: '123',
  fundingSource: [FundingSourceType.TRUST_FUND],
  fundingSourceTrustFund: 'trust fund',
  fundingSourceOther: null,
  fundingSourceNote: null,
  fundingSourceR: [FundingSourceType.OTHER],
  fundingSourceRTrustFund: null,
  fundingSourceROther: null,
  fundingSourceRNote: null,
  payRecipients: [PayRecipient.BENEFICIARIES],
  payRecipientsOtherSpecification: null,
  payRecipientsNote: null,
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payTypeNote: null,
  payClaims: [ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING]
};

const paymentMock = [
  {
    request: {
      query: GetFunding,
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

describe('Model Plan Payment', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment'
        ]}
      >
        <MockedProvider mocks={paymentMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/task-list/payment">
            <FundingSource />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-funding-source-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-funding-source-trust-fund')
      ).toHaveValue('trust fund');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/task-list/payment'
        ]}
      >
        <MockedProvider mocks={paymentMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/task-list/payment">
            <FundingSource />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
