import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GetOperationalNeed from 'queries/ITSolutions/GetOperationalNeed';
import GetOperationalNeedAnswer from 'queries/ITSolutions/GetOperationalNeedAnswer';
import {
  OperationalNeedKey,
  OperationalSolutionKey,
  OpSolutionStatus
} from 'types/graphql-global-types';

import NeedQuestionAndAnswer from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';

const mocks = [
  {
    request: {
      query: GetOperationalNeed,
      variables: {
        id: operationalNeedID
      }
    },
    result: {
      data: {
        operationalNeed: {
          __typename: 'OperationalNeed',
          id: operationalNeedID,
          modelPlanID: modelID,
          name: 'Obtain an application support contractor',
          key: OperationalNeedKey.APP_SUPPORT_CON,
          nameOther: null,
          needed: true,
          solutions: [
            {
              __typename: 'OperationalSolution',
              id: '00000000-0000-0000-0000-000000000000',
              name:
                'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
              key: OperationalSolutionKey.RMADA,
              pocName: null,
              pocEmail: null,
              needed: null,
              nameOther: null,
              mustStartDts: null,
              mustFinishDts: null,
              status: OpSolutionStatus.NOT_STARTED
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: GetOperationalNeedAnswer,
      skip: false,
      variables: {
        id: modelID,
        generalCharacteristics: false,
        participantsAndProviders: true,
        beneficiaries: false,
        opsEvalAndLearning: false,
        payments: false,
        managePartCDEnrollment: false,
        collectPlanBids: false,
        planContactUpdated: false,
        recruitmentMethod: false,
        selectionMethod: true,
        communicationMethod: false,
        providerOverlap: false,
        beneficiaryOverlap: false,
        helpdeskUse: false,
        iddocSupport: false,
        benchmarkForPerformance: false,
        appealPerformance: false,
        appealFeedback: false,
        appealPayments: false,
        appealOther: false,
        evaluationApproaches: false,
        dataNeededForMonitoring: false,
        dataToSendParticicipants: false,
        modelLearningSystems: false,
        payType: false,
        shouldAnyProvidersExcludedFFSSystems: false,
        nonClaimsPayments: false,
        willRecoverPayments: false
      }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          modelName: 'Empty Plan',
          participantsAndProviders: {
            __typename: 'PlanParticipantsAndProviders',
            selectionMethod: [
              'APPLICATION_REVIEW_AND_SCORING_TOOL',
              'APPLICATION_SUPPORT_CONTRACTOR'
            ]
          }
        }
      }
    }
  }
];

describe('IT Solutions NeedQuestionAndAnswer', () => {
  xit('renders correctly', async () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/select-solutions`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/select-solutions">
          <MockedProvider mocks={mocks} addTypename={false}>
            <NeedQuestionAndAnswer
              modelID={modelID}
              operationalNeedID={operationalNeedID}
            />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    const toggleAnswer = getByTestId('toggle-need-answer');
    userEvent.click(toggleAnswer);

    await waitFor(() => {
      expect(getByText('In the Model Plan, you answered')).toBeInTheDocument();
      expect(
        getByText('Use an Application Review and Scoring tool')
      ).toBeInTheDocument();
      expect(
        getByText('Get an application support contractor')
      ).toBeInTheDocument();
    });
  });

  xit('matches snapshot', async () => {
    const { getByTestId, asFragment, getByText } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/select-solutions`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/select-solutions">
          <MockedProvider mocks={mocks} addTypename={false}>
            <NeedQuestionAndAnswer
              modelID={modelID}
              operationalNeedID={operationalNeedID}
            />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    const startingTab = getByTestId('toggle-need-answer');
    userEvent.click(startingTab);

    await waitFor(() => {
      expect(
        getByText('Use an Application Review and Scoring tool')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
