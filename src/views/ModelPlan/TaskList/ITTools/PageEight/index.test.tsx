import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import GetITToolsPageEight from 'queries/ITTools/GetITToolsPageEight';
import {
  GetITToolPageEight_modelPlan_itTools as GetITToolsPageEightType,
  GetITToolPageEight_modelPlan_opsEvalAndLearning as OpsEvalAndLearningType,
  GetITToolPageEight_modelPlan_payments as PaymentsType
} from 'queries/ITTools/types/GetITToolPageEight';
import {
  ModelLearningSystemType,
  OelEducateBeneficiariesType
} from 'types/graphql-global-types';
import { LockStatus } from 'views/SubscriptionHandler';

import ITToolsPageEight from '.';

const itToolsPageEightMockData: GetITToolsPageEightType = {
  __typename: 'PlanITTools',
  id: '',
  oelEducateBeneficiaries: [OelEducateBeneficiariesType.OC],
  oelEducateBeneficiariesOther: '',
  oelEducateBeneficiariesNote: '',
  pMakeClaimsPayments: [],
  pMakeClaimsPaymentsOther: '',
  pMakeClaimsPaymentsNote: '',
  pInformFfs: [],
  pInformFfsOther: '',
  pInformFfsNote: ''
};

const opsEvalAndLearningMockData: OpsEvalAndLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '',
  modelLearningSystems: [ModelLearningSystemType.EDUCATE_BENEFICIARIES]
};

const paymentsMockData: PaymentsType = {
  __typename: 'PlanPayments',
  id: '',
  payType: [],
  shouldAnyProvidersExcludedFFSSystems: null
};

const itToolsPageEightMock = [
  {
    request: {
      query: GetITToolsPageEight,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          itTools: itToolsPageEightMockData,
          opsEvalAndLearning: opsEvalAndLearningMockData,
          payments: paymentsMockData
        }
      }
    }
  }
];

describe('IT Tools Page eight', () => {
  it('renders without errors', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-eight'
        ]}
      >
        <MockedProvider mocks={itToolsPageEightMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-eight">
            <ITToolsPageEight
              opsEvalAndLearningLock={LockStatus.LOCKED}
              paymentsLock={LockStatus.LOCKED}
            />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('it-tools-page-eight-form')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        getByTestId('tools-question-modelLearningSystems')
      ).toHaveTextContent('Will the model have a learning strategy?');

      expect(
        getByTestId('has-answered-tools-question-modelLearningSystems')
      ).toHaveTextContent('You previously answered:');

      expect(getByTestId('tools-answers')).toHaveTextContent(
        'We plan to educate beneficiaries'
      );

      expect(
        getByTestId('it-tools-oel-educate-beneficiaries-OC')
      ).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-eight'
        ]}
      >
        <MockedProvider mocks={itToolsPageEightMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-eight">
            <ITToolsPageEight
              opsEvalAndLearningLock={LockStatus.LOCKED}
              paymentsLock={LockStatus.LOCKED}
            />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByTestId('tools-question-modelLearningSystems')
      ).toHaveTextContent('Will the model have a learning strategy?');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
