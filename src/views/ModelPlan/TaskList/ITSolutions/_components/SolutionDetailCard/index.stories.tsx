import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ComponentMeta } from '@storybook/react';

import { GetOperationalSolution_operationalSolution as GetOperationalSolutionType } from 'queries/ITSolutions/types/GetOperationalSolution';
import {
  OperationalSolutionKey,
  OpSolutionStatus
} from 'types/graphql-global-types';

import needQuestionAndAnswerMock from '../NeedQuestionAndAnswer/mocks';

import SolutionDetailCard from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';
const operationalSolutionID = '786f6717-f718-4657-8df9-58ec9bca5c1c';

const solution: GetOperationalSolutionType = {
  __typename: 'OperationalSolution',
  id: operationalSolutionID,
  name: 'Internal staff',
  key: OperationalSolutionKey.SHARED_SYSTEMS,
  isOther: false,
  pocName: 'John Mint',
  pocEmail: 'john.mint@oddball.io',
  needed: true,
  nameOther: null,
  status: OpSolutionStatus.IN_PROGRESS,
  documents: [],
  mustFinishDts: '2022-12-30T15:01:39.190679Z',
  mustStartDts: null,
  operationalSolutionSubtasks: []
};

export default {
  title: 'Operational Solution Detail Card',
  component: SolutionDetailCard,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/solution-details`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/solution-details">
          <Story />
        </Route>
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof SolutionDetailCard>;

export const Default = () => (
  <SolutionDetailCard
    solution={solution}
    modelID={modelID}
    operationalNeedID={operationalNeedID}
    operationalSolutionID={operationalSolutionID}
  />
);

Default.parameters = {
  apolloClient: {
    mocks: needQuestionAndAnswerMock
  }
};
