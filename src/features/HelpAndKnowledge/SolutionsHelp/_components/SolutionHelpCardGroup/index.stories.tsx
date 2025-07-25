import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';

import { helpSolutionsArray } from '../../solutionsMap';

import SolutionHelpCardGroup from '.';

export default {
  title: 'Help and Knowledge SolutionHelpCardGroup',
  component: SolutionHelpCardGroup,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <SolutionHelpCardGroup
            solutions={helpSolutionsArray}
            setResultsNum={() => null}
          />
        </Route>
      </MemoryRouter>
    )
  ]
} as Meta<typeof SolutionHelpCardGroup>;

export const Default = () => (
  <SolutionHelpCardGroup
    solutions={helpSolutionsArray}
    setResultsNum={() => null}
  />
);
