import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  act,
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetOperationalSolutionQuery,
  OperationalSolutionKey,
  OpSolutionStatus
} from 'gql/generated/graphql';
import {
  needQuestionAndAnswerMock,
  possibleSolutionsMock
} from 'tests/mock/solutions';
import VerboseMockedProvider from 'tests/MockedProvider';

import { MessageProvider } from 'hooks/useMessage';

import SolutionDetailCard from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';
const operationalSolutionID = '786f6717-f718-4657-8df9-58ec9bca5c1c';

type GetOperationalSolutionType =
  GetOperationalSolutionQuery['operationalSolution'];

const solution: GetOperationalSolutionType = {
  __typename: 'OperationalSolution',
  id: operationalSolutionID,
  name: 'Internal staff',
  key: OperationalSolutionKey.SHARED_SYSTEMS,
  pocName: 'John Mint',
  pocEmail: 'john.mint@oddball.io',
  needed: true,
  isOther: false,
  isCommonSolution: true,
  otherHeader: null,
  nameOther: null,
  status: OpSolutionStatus.IN_PROGRESS,
  documents: [],
  mustFinishDts: '2022-12-30T15:01:39.190679Z',
  mustStartDts: null,
  operationalSolutionSubtasks: []
};

const mocks = [...possibleSolutionsMock, ...needQuestionAndAnswerMock];

describe('SolutionDetailsCard', () => {
  it('matches snapshot', async () => {
    await act(async () => {
      const { asFragment, getByText, getByTestId } = render(
        <MemoryRouter
          initialEntries={[
            `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/solution-implementation-details`
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
            <VerboseMockedProvider mocks={mocks} addTypename={false}>
              <MessageProvider>
                <SolutionDetailCard
                  solution={solution}
                  modelID={modelID}
                  operationalNeedID={operationalNeedID}
                  operationalSolutionID={operationalSolutionID}
                />
              </MessageProvider>
            </VerboseMockedProvider>
          </Route>
        </MemoryRouter>
      );

      await waitForElementToBeRemoved(() => getByTestId('needs-spinner'));

      await waitFor(() => {
        expect(
          getByText('Obtain an application support contractor')
        ).toBeInTheDocument();
        expect(getByText('December 30, 2022')).toBeInTheDocument();
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('isUpdatingStatus variant', async () => {
    await act(async () => {
      const { asFragment, getByText, getByTestId } = render(
        <MemoryRouter
          initialEntries={[
            `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/solution-implementation-details`
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
            <VerboseMockedProvider mocks={mocks} addTypename={false}>
              <MessageProvider>
                <SolutionDetailCard
                  solution={solution}
                  modelID={modelID}
                  operationalNeedID={operationalNeedID}
                  operationalSolutionID={operationalSolutionID}
                  isUpdatingStatus
                />
              </MessageProvider>
            </VerboseMockedProvider>
          </Route>
        </MemoryRouter>
      );

      await waitForElementToBeRemoved(() => getByTestId('needs-spinner'));

      await waitFor(() => {
        expect(() => getByText('Must start by')).toThrow();
        expect(() => getByText('December 30, 2022')).toThrow();
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
