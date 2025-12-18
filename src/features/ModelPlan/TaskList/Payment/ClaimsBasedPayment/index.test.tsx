import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  ClaimsBasedPayType,
  GetClaimsBasedPaymentDocument,
  GetClaimsBasedPaymentQuery,
  PayType
} from 'gql/generated/graphql';
import { modelPlanBaseMock } from 'tests/mock/general';

import ModelInfoWrapper from 'contexts/ModelInfoContext';

import ClaimsBasedPayment from './index';

type GetClaimsBasedPaymentType =
  GetClaimsBasedPaymentQuery['modelPlan']['payments'];

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
      query: GetClaimsBasedPaymentDocument,
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

describe('Model Plan -- Claims Based Payment', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/payment/claims-based-payment',
          element: (
            <ModelInfoWrapper>
              <ClaimsBasedPayment />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/payment/claims-based-payment'
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
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/payment/claims-based-payment',
          element: (
            <ModelInfoWrapper>
              <ClaimsBasedPayment />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/payment/claims-based-payment'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={paymentsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('payment-pay-claims-other')).toHaveValue(
        'pay claims other'
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
