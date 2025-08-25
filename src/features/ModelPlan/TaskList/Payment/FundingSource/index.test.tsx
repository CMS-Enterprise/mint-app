import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import {
  FundingSource as FundingSourceType,
  GetFundingDocument,
  GetFundingQuery,
  PayType
} from 'gql/generated/graphql';
import VerboseMockedProvider from 'tests/MockedProvider';

import FundingSource from './index';

type FundingType = GetFundingQuery['modelPlan']['payments'];

const modelPlanID: string = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

const mockData: FundingType = {
  __typename: 'PlanPayments',
  id: '123',
  fundingSource: [FundingSourceType.MEDICARE_PART_B_SMI_TRUST_FUND],
  fundingSourcePatientProtectionInfo: '',
  fundingSourceMedicareAInfo: '',
  fundingSourceMedicareBInfo: 'PartB',
  fundingSourceOther: null,
  fundingSourceNote: null,
  fundingSourceR: [],
  fundingSourceRPatientProtectionInfo: '',
  fundingSourceRMedicareAInfo: '',
  fundingSourceRMedicareBInfo: '',
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
              __typename: 'OperationalNeed',
              id: '424213',
              modifiedDts: null
            }
          ]
        }
      }
    }
  }
];

describe('Model Plan Payment', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/payment',
          element: <FundingSource />
        }
      ],
      {
        initialEntries: [
          `/models/${modelPlanID}/collaboration-area/task-list/payment`
        ]
      }
    );

    const { getByTestId } = render(
      <VerboseMockedProvider mocks={paymentMock} addTypename={false}>
        <RouterProvider router={router} />
      </VerboseMockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-funding-source-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      const checkbox = getByTestId(
        'payment-funding-source-fundingSource-MEDICARE_PART_B_SMI_TRUST_FUND'
      );
      expect(checkbox).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/payment',
          element: <FundingSource />
        }
      ],
      {
        initialEntries: [
          `/models/${modelPlanID}/collaboration-area/task-list/payment`
        ]
      }
    );

    const { asFragment, getByTestId } = render(
      <VerboseMockedProvider mocks={paymentMock} addTypename={false}>
        <RouterProvider router={router} />
      </VerboseMockedProvider>
    );

    await waitFor(() => {
      const checkbox = getByTestId(
        'payment-funding-source-fundingSource-MEDICARE_PART_B_SMI_TRUST_FUND'
      );
      expect(checkbox).toBeChecked();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
