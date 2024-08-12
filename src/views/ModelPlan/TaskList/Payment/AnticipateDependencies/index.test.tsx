import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  ClaimsBasedPayType,
  GetAnticipateDependenciesDocument,
  GetAnticipateDependenciesQuery,
  PayType
} from 'gql/gen/graphql';

import AnticipateDependencies from './index';

type GetAnticipateDependenciesType = GetAnticipateDependenciesQuery['modelPlan']['payments'];

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
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment/anticipating-dependencies'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment/anticipating-dependencies">
            <AnticipateDependencies />
          </Route>
        </MockedProvider>
      </MemoryRouter>
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
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/payment/anticipating-dependencies'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/payment/anticipating-dependencies">
            <AnticipateDependencies />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('payment-anticipate-dependencies-form')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
