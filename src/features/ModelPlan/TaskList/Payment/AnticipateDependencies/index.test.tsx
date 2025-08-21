import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  ClaimsBasedPayType,
  GetAnticipateDependenciesDocument,
  GetAnticipateDependenciesQuery,
  PayType
} from 'gql/generated/graphql';

import AnticipateDependencies from './index';

type GetAnticipateDependenciesType =
  GetAnticipateDependenciesQuery['modelPlan']['payments'];

const mockData: GetAnticipateDependenciesType = {
  __typename: 'PlanPayments',
  id: '123',
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payClaims: [ClaimsBasedPayType.OTHER],
  willBePaymentAdjustments: true,
  willBePaymentAdjustmentsNote: 'Payment adjustments note',
  creatingDependenciesBetweenServices: null,
  creatingDependenciesBetweenServicesNote: null,
  needsClaimsDataCollection: true,
  needsClaimsDataCollectionNote: null,
  providingThirdPartyFile: null,
  isContractorAwareTestDataRequirements: null
};

const paymentsMock = [
  {
    request: {
      query: GetAnticipateDependenciesDocument,
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

describe('Model Plan -- Anticipate Dependencies', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/payment/anticipating-dependencies',
          element: <AnticipateDependencies />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/payment/anticipating-dependencies'
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
        screen.getByTestId('payment-anticipate-dependencies-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-needs-claims-data-collection-true')
      ).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/payment/anticipating-dependencies',
          element: <AnticipateDependencies />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/payment/anticipating-dependencies'
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
        screen.getByTestId('payment-will-be-payment-adjustments-note')
      ).toHaveValue('Payment adjustments note');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
