import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ComponentMeta } from '@storybook/react';

import { helpSolutions } from '../../solutionsMap';

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
            solutions={helpSolutions}
            isQuery={false}
            setResultsNum={() => null}
          />
        </Route>
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof SolutionHelpCardGroup>;

export const Default = () => (
  <SolutionHelpCardGroup
    solutions={helpSolutions}
    isQuery={false}
    setResultsNum={() => null}
  />
);
