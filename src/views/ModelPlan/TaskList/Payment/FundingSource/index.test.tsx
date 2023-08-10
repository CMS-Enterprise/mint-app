import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetFunding from 'queries/Payments/GetFunding';
import { GetFunding_modelPlan_payments as GetFundingType } from 'queries/Payments/types/GetFunding';
import {
  FundingSource as FundingSourceType,
  PayType
} from 'types/graphql-global-types';

import FundingSource from './index';

const mockData: GetFundingType = {
  __typename: 'PlanPayments',
  id: '123',
  fundingSource: [FundingSourceType.TRUST_FUND],
  fundingSourceOther: null,
  fundingSourceNote: null,
  fundingSourceR: [],
  fundingSourceROther: null,
  fundingSourceRNote: null,
  payRecipients: [],
  payRecipientsOtherSpecification: null,
  payRecipientsNote: null,
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payTypeNote: null,
  payClaims: []
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

describe('Model Plan Payment', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment'
        ]}
      >
        <MockedProvider mocks={paymentMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment">
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
      ).toHaveValue('Trust Fund');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment'
        ]}
      >
        <MockedProvider mocks={paymentMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment">
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
    expect(asFragment()).toMatchSnapshot();
  });
});
