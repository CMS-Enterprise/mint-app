import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import { OperationalSolutionKey } from 'gql/gen/graphql';

import SolutionCard, { SolutionCardType } from '.';

export default {
  title: 'Operational Need Solution Card',
  component: SolutionCard,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={[
          '/models/602287ff-d9d5-4203-86eb-e168fbd47242/collaboration-area/task-list/it-solutions/f92a8a35-86de-4e03-a81a-bd8bec2e30e3/solution-implementation-details'
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
          <Story />
        </Route>
      </MemoryRouter>
    )
  ]
} as Meta<typeof SolutionCard>;

const solution: SolutionCardType = {
  __typename: 'OperationalSolution',
  id: 'fcd84732-3de2-4b7d-b025-4f977ed137d2',
  name: 'Shared Systems',
  isOther: false,
  otherHeader: null,
  key: OperationalSolutionKey.SHARED_SYSTEMS,
  pocName: 'John Mint',
  pocEmail: 'john.mint@oddball.io',
  isCommonSolution: true,
  needed: true,
  nameOther: null
};

const customSolution: SolutionCardType = {
  __typename: 'OperationalSolution',
  id: 'fcd84732-3de2-4b7d-b025-4f977ed137d2',
  name: null,
  nameOther: 'My Custom Solutuon',
  isOther: true,
  otherHeader: null,
  isCommonSolution: true,
  key: null,
  pocName: 'John Mint',
  pocEmail: 'john.mint@oddball.io',
  needed: true
};
export const Default = () => (
  <GridContainer>
    <Grid desktop={{ col: 6 }}>
      <SolutionCard solution={solution} shadow />
    </Grid>
  </GridContainer>
);

export const Custom = () => (
  <GridContainer>
    <Grid desktop={{ col: 6 }}>
      <SolutionCard solution={customSolution} shadow />
    </Grid>
  </GridContainer>
);

export const CreatingCustom = () => (
  <GridContainer>
    <Grid desktop={{ col: 6 }}>
      <SolutionCard solution={customSolution} shadow addingCustom />
    </Grid>
  </GridContainer>
);
