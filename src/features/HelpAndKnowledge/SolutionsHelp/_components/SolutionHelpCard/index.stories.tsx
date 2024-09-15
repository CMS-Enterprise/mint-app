import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';

import { helpSolutions } from '../../solutionsMap';

import SolutionHelpCard from '.';

export default {
  title: 'Help and Knowledge SolutionHelpCard',
  component: SolutionHelpCard,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <SolutionHelpCard solution={helpSolutions[0]} />
        </Route>
      </MemoryRouter>
    )
  ]
} as Meta<typeof SolutionHelpCard>;

export const Default = () => <SolutionHelpCard solution={helpSolutions[0]} />;
