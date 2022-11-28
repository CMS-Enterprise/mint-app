import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ComponentMeta } from '@storybook/react';

import { OperationalSolutionKey } from 'types/graphql-global-types';

import SolutionCard, { SolutionCardType } from '.';

export default {
  title: 'Operational Need Solution Card',
  component: SolutionCard,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={[
          '/models/602287ff-d9d5-4203-86eb-e168fbd47242/task-list/it-solutions/f92a8a35-86de-4e03-a81a-bd8bec2e30e3/solution-implementation-details'
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
          <Story />
        </Route>
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof SolutionCard>;

const solution: SolutionCardType = {
  __typename: 'OperationalSolution',
  id: 'fcd84732-3de2-4b7d-b025-4f977ed137d2',
  name: 'Through a contractor',
  key: OperationalSolutionKey.THROUGH_A_CONTRACTOR,
  pocName: 'John Mint',
  pocEmail: 'john.mint@oddball.io',
  needed: true,
  nameOther: null
};

const customSolution: SolutionCardType = {
  __typename: 'OperationalSolution',
  id: 'fcd84732-3de2-4b7d-b025-4f977ed137d2',
  name: null,
  nameOther: 'My Custom Solutuon',
  key: null,
  pocName: 'John Mint',
  pocEmail: 'john.mint@oddball.io',
  needed: true
};

export const Default = () => <SolutionCard solution={solution} shadow />;

export const Custom = () => <SolutionCard solution={customSolution} shadow />;

export const CreatingCustom = () => (
  <SolutionCard solution={customSolution} shadow addingCustom />
);
