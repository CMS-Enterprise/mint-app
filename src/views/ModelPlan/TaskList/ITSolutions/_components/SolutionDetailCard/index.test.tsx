import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import { GetOperationalSolution_operationalSolution as GetOperationalSolutionType } from 'queries/ITSolutions/types/GetOperationalSolution';
import {
  OperationalSolutionKey,
  OpSolutionStatus
} from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/MockedProvider';

import needQuestionAndAnswerMock from '../NeedQuestionAndAnswer/mocks';

import SolutionDetailCard from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';
const operationalSolutionID = '786f6717-f718-4657-8df9-58ec9bca5c1c';

const solution: GetOperationalSolutionType = {
  __typename: 'OperationalSolution',
  id: operationalSolutionID,
  name: 'Internal staff',
  key: OperationalSolutionKey.THROUGH_A_CONTRACTOR,
  pocName: 'John Mint',
  pocEmail: 'john.mint@oddball.io',
  needed: true,
  nameOther: null,
  status: OpSolutionStatus.IN_PROGRESS,
  mustFinishDts: '2022-12-30T15:01:39.190679Z',
  mustStartDts: null
};

describe('SolutionDetailsCard', () => {
  xit('matches snapshot', async () => {
    const { asFragment, getByText } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/solution-implementation-details`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
          <VerboseMockedProvider
            mocks={needQuestionAndAnswerMock}
            addTypename={false}
          >
            <SolutionDetailCard
              solution={solution}
              modelID={modelID}
              operationalNeedID={operationalNeedID}
            />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('December 30, 2022')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
