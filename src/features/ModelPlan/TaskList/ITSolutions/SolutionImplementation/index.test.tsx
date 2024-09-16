import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { act, render, waitFor } from '@testing-library/react';
import {
  GetOperationalNeedDocument,
  GetOperationalNeedQuery,
  OperationalNeedKey,
  OperationalSolutionKey,
  OpSolutionStatus
} from 'gql/generated/graphql';
import {
  needQuestionAndAnswerMock,
  possibleSolutionsMock
} from 'tests/mock/solutions';
import setup from 'tests/util';

import MessageProvider from 'contexts/MessageContext';

import SolutionImplmentation from '.';

type GetOperationalNeedType = GetOperationalNeedQuery['operationalNeed'];

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';

const operationalNeed: GetOperationalNeedType = {
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
      name: 'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
      pocEmail: '',
      key: OperationalSolutionKey.RMADA,
      mustStartDts: null,
      mustFinishDts: null,
      isOther: false,
      isCommonSolution: true,
      otherHeader: null,
      status: OpSolutionStatus.AT_RISK,
      needed: true,
      pocName: 'John Doe',
      nameOther: null
    }
  ]
};

const mocks = [
  {
    request: {
      query: GetOperationalNeedDocument,
      variables: {
        id: operationalNeedID,
        includeNotNeeded: false
      }
    },
    result: {
      data: {
        operationalNeed
      }
    }
  },
  ...possibleSolutionsMock,
  ...needQuestionAndAnswerMock
];

describe('Operational Solutions NeedQuestionAndAnswer', () => {
  it('renders correctly', async () => {
    await act(async () => {
      const { getByText, getAllByTestId, getByRole, user } = setup(
        <MemoryRouter
          initialEntries={[
            {
              pathname: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/solution-implementation-details`
            }
          ]}
        >
          <MockedProvider mocks={mocks} addTypename={false}>
            <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
              <MessageProvider>
                <SolutionImplmentation />
              </MessageProvider>
            </Route>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          getByText('Research, Measurement, Assessment, Design, and Analysis')
        ).toBeInTheDocument();
      });

      const datePicker = getAllByTestId('date-picker-external-input')[0];
      await user.type(datePicker, '12/10/2030');

      await waitFor(() => {
        expect(datePicker).toHaveValue('12/10/2030');
      });

      const atRisk = getByRole('radio', { name: 'At risk' });
      const backlog = getByRole('radio', { name: 'Backlog' });
      await user.click(backlog);

      await waitFor(() => {
        expect(atRisk).not.toBeChecked();
        expect(backlog).toBeChecked();
      });
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByText } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/solution-implementation-details`
          }
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
            <MessageProvider>
              <SolutionImplmentation />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('at.mint@oddball.io')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
