import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import GetITToolsPageNine from 'queries/ITTools/GetITToolsPageNine';
import {
  GetITToolPageNine_modelPlan_itTools as GetITToolsPageNineType,
  GetITToolPageNine_modelPlan_payments as PaymentsType
} from 'queries/ITTools/types/GetITToolPageNine';
import {
  PayType,
  PNonClaimsBasedPaymentsType
} from 'types/graphql-global-types';

import ITToolsPageNine from '.';

const itToolsPageNineMockData: GetITToolsPageNineType = {
  __typename: 'PlanITTools',
  id: '',
  pNonClaimsBasedPayments: [PNonClaimsBasedPaymentsType.APPS],
  pNonClaimsBasedPaymentsOther: '',
  pNonClaimsBasedPaymentsNote: '',
  pSharedSavingsPlan: [],
  pSharedSavingsPlanOther: '',
  pSharedSavingsPlanNote: '',
  pRecoverPayments: [],
  pRecoverPaymentsOther: '',
  pRecoverPaymentsNote: ''
};

const paymentsMockData: PaymentsType = {
  __typename: 'PlanPayments',
  id: '',
  payType: [PayType.NON_CLAIMS_BASED_PAYMENTS],
  nonClaimsPayments: [],
  willRecoverPayments: null
};

const itToolsPageNineMock = [
  {
    request: {
      query: GetITToolsPageNine,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          itTools: itToolsPageNineMockData,
          payments: paymentsMockData
        }
      }
    }
  }
];

describe('IT Tools Page nine', () => {
  it('renders without errors', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-nine'
        ]}
      >
        <MockedProvider mocks={itToolsPageNineMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-nine">
            <ITToolsPageNine />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('it-tools-page-nine-form')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByTestId('tools-question-payType')).toHaveTextContent(
        'What will you pay?'
      );

      expect(
        getByTestId('has-answered-tools-question-payType')
      ).toHaveTextContent('You previously answered:');

      expect(getByTestId('tools-answers')).toHaveTextContent(
        'Non-Claims-Based Payments'
      );

      expect(getByTestId('it-tools-p-non-claims-payments-APPS')).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-nine'
        ]}
      >
        <MockedProvider mocks={itToolsPageNineMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-nine">
            <ITToolsPageNine />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('tools-question-payType')).toHaveTextContent(
        'What will you pay?'
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
