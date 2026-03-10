import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  ClaimsBasedPayType,
  FrequencyType,
  GetRecoverDocument,
  GetRecoverQuery,
  PayType,
  TaskStatus
} from 'gql/generated/graphql';
import { modelID, modelPlanBaseMock } from 'tests/mock/general';

import ModelInfoWrapper from 'contexts/ModelInfoContext';

import Recover from './index';

type GetRecoverType = GetRecoverQuery['modelPlan']['payments'];

const RECOVER_PATH =
  '/models/:modelID/collaboration-area/task-list/payment/recover-payment';
const recoverRoute = (modelId: string) =>
  `/models/${modelId}/collaboration-area/task-list/payment/recover-payment`;

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

const getRecoverMock = {
  request: {
    query: GetRecoverDocument,
    variables: { id: modelID }
  },
  result: {
    data: {
      modelPlan: {
        __typename: 'ModelPlan',
        id: modelID,
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
};

// Each mock is consumed once per matching query. React Strict Mode double-mounts components,
// so GetRecover can run twice in a single test. We include two of each so mocks aren't exhausted.
const getPaymentsMocks = () => [
  getRecoverMock,
  getRecoverMock,
  ...modelPlanBaseMock,
  ...modelPlanBaseMock
];

function createRecoverRouter() {
  return createMemoryRouter(
    [
      {
        path: RECOVER_PATH,
        element: (
          <ModelInfoWrapper>
            <Recover />
          </ModelInfoWrapper>
        )
      }
    ],
    { initialEntries: [recoverRoute(modelID)] }
  );
}

async function waitForRecoverForm() {
  await waitFor(() => {
    expect(screen.getByTestId('payment-recover-form')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(
      screen.getByTestId('payment-anticipate-reconciling-payment-retro-true')
    ).toBeChecked();
  });
}

function renderRecover() {
  return render(
    <MockedProvider mocks={getPaymentsMocks()}>
      <RouterProvider router={createRecoverRouter()} />
    </MockedProvider>
  );
}

describe('Model Plan -- Recover', () => {
  it('renders without errors', async () => {
    renderRecover();
    await waitForRecoverForm();
  });

  it('matches snapshot', async () => {
    const { asFragment } = renderRecover();
    await waitForRecoverForm();

    // Wait for AddNote textareas (they sync from Formik in useEffect); avoids flaky snapshot.
    await waitFor(() => {
      expect(
        screen.getByTestId('payment-recover-payment-note')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('payment-payment-start-date-note')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
