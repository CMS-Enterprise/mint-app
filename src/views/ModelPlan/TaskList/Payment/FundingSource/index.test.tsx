import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetFundingDocument,
  GetFundingQuery,
  TrustFundType
} from 'gql/gen/graphql';
import Sinon from 'sinon';

import {
  FundingSource as FundingSourceType,
  PayType
} from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/MockedProvider';

import FundingSource from './index';

type FundingType = GetFundingQuery['modelPlan']['payments'];

const modelPlanID: string = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

const mockData: FundingType = {
  __typename: 'PlanPayments',
  id: '123',
  fundingSource: [FundingSourceType.TRUST_FUND],
  fundingSourceTrustFundType: [TrustFundType.MEDICARE_PART_A_HI_TRUST_FUND],
  fundingSourceOther: null,
  fundingSourceNote: null,
  fundingSourceR: [],
  fundingSourceRTrustFundType: [TrustFundType.MEDICARE_PART_A_HI_TRUST_FUND],
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
      query: GetFundingDocument,
      variables: { id: modelPlanID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelPlanID,
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
  // Stubing Math.random that occurs in Truss Tooltip component for deterministic output
  Sinon.stub(Math, 'random').returns(0.5);

  it('renders without errors', async () => {
    const { getAllByRole } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelPlanID}/task-list/payment`]}
      >
        <VerboseMockedProvider mocks={paymentMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment">
            <FundingSource />
          </Route>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-funding-source-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      const checkbox = getAllByRole('checkbox', { name: /Trust Fund/i })[0];
      expect(checkbox).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getAllByRole } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelPlanID}/task-list/payment`]}
      >
        <VerboseMockedProvider mocks={paymentMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment">
            <FundingSource />
          </Route>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const checkbox = getAllByRole('checkbox', { name: /Trust Fund/i })[0];
      expect(checkbox).toBeChecked();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
