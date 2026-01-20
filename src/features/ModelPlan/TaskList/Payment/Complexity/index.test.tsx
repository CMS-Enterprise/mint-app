import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  ClaimsBasedPayType,
  ComplexityCalculationLevelType,
  FrequencyType,
  GetComplexityDocument,
  GetComplexityQuery,
  GetComplexityQueryVariables,
  PayType
} from 'gql/generated/graphql';
import { modelPlanBaseMockData } from 'tests/mock/general';

import { ModelInfoContext } from 'contexts/ModelInfoContext';

import Complexity from './index';

type GetComplexityType = GetComplexityQuery['modelPlan']['payments'];

const mockData: GetComplexityType = {
  __typename: 'PlanPayments',
  id: '123',
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payClaims: [ClaimsBasedPayType.OTHER],
  expectedCalculationComplexityLevel: ComplexityCalculationLevelType.HIGH,
  expectedCalculationComplexityLevelNote: null,
  claimsProcessingPrecedence: true,
  claimsProcessingPrecedenceOther: 'other claims',
  claimsProcessingPrecedenceNote: 'claim note',
  canParticipantsSelectBetweenPaymentMechanisms: true,
  canParticipantsSelectBetweenPaymentMechanismsHow: 'lorem ipsum',
  canParticipantsSelectBetweenPaymentMechanismsNote: null,
  anticipatedPaymentFrequency: [FrequencyType.ANNUALLY],
  anticipatedPaymentFrequencyContinually: null,
  anticipatedPaymentFrequencyOther: null,
  anticipatedPaymentFrequencyNote: null
};

const paymentsMock: MockedResponse<
  GetComplexityQuery,
  GetComplexityQueryVariables
>[] = [
  {
    request: {
      query: GetComplexityDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlan: {
          __typename: 'ModelPlan',
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
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/payment/complexity',
          element: (
            <ModelInfoContext.Provider value={modelPlanBaseMockData}>
              <Complexity />
            </ModelInfoContext.Provider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/payment/complexity'
        ]
      }
    );

    render(
      <MockedProvider mocks={paymentsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
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
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/payment/complexity',
          element: (
            <ModelInfoContext.Provider value={modelPlanBaseMockData}>
              <Complexity />
            </ModelInfoContext.Provider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/payment/complexity'
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
        screen.getByTestId('payment-claims-processing-precendece-note')
      ).toHaveValue('claim note');
    });

    await waitFor(() => {
      expect(screen.getByTestId('payment-multiple-payments-how')).toHaveValue(
        'lorem ipsum'
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
