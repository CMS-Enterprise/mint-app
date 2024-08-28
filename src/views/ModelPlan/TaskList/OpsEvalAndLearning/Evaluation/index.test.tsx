import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CcmInvolvmentType,
  EvaluationApproachType,
  GetEvaluationDocument,
  GetEvaluationQuery
} from 'gql/gen/graphql';

import Evaluation from '.';

type GetEvaluationType = GetEvaluationQuery['modelPlan']['opsEvalAndLearning'];

const evaluationMockData: GetEvaluationType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION],
  iddocSupport: true,
  evaluationApproaches: [EvaluationApproachType.COMPARISON_MATCH],
  evaluationApproachOther: '',
  evalutaionApproachNote: '',
  ccmInvolvmentOther: '',
  ccmInvolvmentNote: '',
  dataNeededForMonitoring: [],
  dataNeededForMonitoringOther: '',
  dataNeededForMonitoringNote: '',
  dataToSendParticicipants: [],
  dataToSendParticicipantsOther: '',
  dataToSendParticicipantsNote: '',
  shareCclfData: true,
  shareCclfDataNote: ''
};

const evaluationMock = [
  {
    request: {
      query: GetEvaluationDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: evaluationMockData,
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
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/evaluation'
        ]}
      >
        <MockedProvider mocks={evaluationMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/evaluation">
            <Evaluation />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-evaluation-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-share-cclf-data-true')
      ).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/evaluation'
        ]}
      >
        <MockedProvider mocks={evaluationMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/evaluation">
            <Evaluation />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-share-cclf-data-true')
      ).toBeChecked();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
