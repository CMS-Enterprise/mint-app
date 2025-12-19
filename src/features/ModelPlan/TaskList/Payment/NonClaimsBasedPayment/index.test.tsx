import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  ClaimsBasedPayType,
  GetNonClaimsBasedPaymentDocument,
  GetNonClaimsBasedPaymentQuery,
  NonClaimsBasedPayType,
  PayType
} from 'gql/generated/graphql';
import { modelPlanBaseMock } from 'tests/mock/general';

import ModelInfoWrapper from 'contexts/ModelInfoContext';

import NonClaimsBasedPayment from './index';

type GetNonClaimsBasedPaymentType =
  GetNonClaimsBasedPaymentQuery['modelPlan']['payments'];

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
      query: GetNonClaimsBasedPaymentDocument,
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
              __typename: 'OperationalNeed',
              id: '424213',
              modifiedDts: null
            }
          ]
        }
      }
    }
  },
  ...modelPlanBaseMock
];

describe('Model Plan -- NonClaimsBasedPayment', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/payment/non-claims-based-payment',
          element: (
            <ModelInfoWrapper>
              <NonClaimsBasedPayment />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/payment/non-claims-based-payment'
        ]
      }
    );

    render(
      <MockedProvider mocks={paymentsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-nonclaims-payments-other')
      ).toHaveValue('Lorem Ipsum');
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/payment/non-claims-based-payment',
          element: (
            <ModelInfoWrapper>
              <NonClaimsBasedPayment />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/payment/non-claims-based-payment'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={paymentsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-nonclaims-payments-other')
      ).toHaveValue('Lorem Ipsum');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
