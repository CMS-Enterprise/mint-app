import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  ClaimsBasedPayType,
  FrequencyType,
  GetRecoverDocument,
  GetRecoverQuery,
  PayType,
  TaskStatus
} from 'gql/generated/graphql';

import Recover from './index';

type GetRecoverType = GetRecoverQuery['modelPlan']['payments'];

const mockData: GetRecoverType = {
  __typename: 'PlanPayments',
  id: '123',
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payClaims: [ClaimsBasedPayType.OTHER],
  willRecoverPayments: null,
  willRecoverPaymentsNote: 'string',
  anticipateReconcilingPaymentsRetrospectively: true,
  anticipateReconcilingPaymentsRetrospectivelyNote: 'string',
  paymentReconciliationFrequency: [FrequencyType.CONTINUALLY],
  paymentReconciliationFrequencyContinually: 'Continual Frequency',
  paymentReconciliationFrequencyOther: '',
  paymentReconciliationFrequencyNote: 'Reconciliation note',
  paymentDemandRecoupmentFrequency: [FrequencyType.CONTINUALLY],
  paymentDemandRecoupmentFrequencyContinually: 'Continual Frequency',
  paymentDemandRecoupmentFrequencyOther: '',
  paymentDemandRecoupmentFrequencyNote: 'Demand and Recoupment note',
  paymentStartDate: null,
  paymentStartDateNote: 'string',
  readyForReviewByUserAccount: {
    commonName: 'ASDF',
    id: '000',
    __typename: 'UserAccount'
  },
  readyForReviewDts: '2022-05-12T15:01:39.190679Z',
  status: TaskStatus.IN_PROGRESS
};

const paymentsMock = [
  {
    request: {
      query: GetRecoverDocument,
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
  }
];

describe('Model Plan -- Recover', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/payment/recover-payment'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/payment/recover-payment">
            <Recover />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('payment-recover-form')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('payment-anticipate-reconciling-payment-retro-true')
      ).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/payment/recover-payment'
        ]}
      >
        <MockedProvider mocks={paymentsMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/payment/recover-payment">
            <Recover />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() =>
      screen.getByTestId('payment-payment-start-date-note-add-note-toggle')
    );

    expect(asFragment()).toMatchSnapshot();

    expect(asFragment()).toMatchSnapshot();
  });
});
