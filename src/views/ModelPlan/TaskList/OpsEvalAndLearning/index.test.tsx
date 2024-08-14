import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CcmInvolvmentType,
  GetOpsEvalAndLearningDocument,
  GetOpsEvalAndLearningQuery
} from 'gql/gen/graphql';

import {
  isCCWInvolvement,
  OpsEvalAndLearningContent,
  renderCurrentPage,
  renderTotalPages
} from './index';

type GetOpsEvalAndLearningType = GetOpsEvalAndLearningQuery['modelPlan']['opsEvalAndLearning'];

const opsEvalAndLearningMockData: GetOpsEvalAndLearningType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [],
  dataNeededForMonitoring: [],
  stakeholders: [],
  stakeholdersOther: '',
  stakeholdersNote: '',
  helpdeskUse: null,
  helpdeskUseNote: '',
  contractorSupport: [],
  contractorSupportOther: '',
  contractorSupportHow: 'Differ text',
  contractorSupportNote: '',
  iddocSupport: null,
  iddocSupportNote: ''
};

const opsEvalAndLearningMock = [
  {
    request: {
      query: GetOpsEvalAndLearningDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: opsEvalAndLearningMockData,
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

describe('Model Plan Ops Eval and Learning', () => {
  it('computes total pages', () => {
    const totalPages9 = renderTotalPages(
      true,
      isCCWInvolvement([CcmInvolvmentType.YES_EVALUATION])
    );
    expect(totalPages9).toEqual(9);

    const totalPages6 = renderTotalPages(
      false,
      isCCWInvolvement([CcmInvolvmentType.YES_EVALUATION])
    );
    expect(totalPages6).toEqual(6);

    const totalPages8 = renderTotalPages(true, isCCWInvolvement([]));
    expect(totalPages8).toEqual(8);
  });

  it('computes current pages', () => {
    const currentPage = renderCurrentPage(
      1,
      true,
      isCCWInvolvement([CcmInvolvmentType.YES_EVALUATION])
    );
    expect(currentPage).toEqual(1);

    const currentPage2 = renderCurrentPage(
      5,
      false,
      isCCWInvolvement([CcmInvolvmentType.YES_EVALUATION])
    );
    expect(currentPage2).toEqual(2);
  });

  it('computes cmmi involvement', () => {
    const cmmiInvolvment = isCCWInvolvement([CcmInvolvmentType.YES_EVALUATION]);
    expect(cmmiInvolvment).toEqual(true);

    const cmmiInvolvmentFalse = isCCWInvolvement([]);
    expect(cmmiInvolvmentFalse).toEqual(false);
  });

  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning'
        ]}
      >
        <MockedProvider mocks={opsEvalAndLearningMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning">
            <OpsEvalAndLearningContent />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-contractor-support-how')
      ).toHaveValue('Differ text');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning'
        ]}
      >
        <MockedProvider mocks={opsEvalAndLearningMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning">
            <OpsEvalAndLearningContent />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-contractor-support-how')
      ).toHaveValue('Differ text');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
