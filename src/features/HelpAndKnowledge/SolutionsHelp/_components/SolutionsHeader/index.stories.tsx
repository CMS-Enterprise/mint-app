import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';

import { helpSolutions } from '../../solutionsMap';

import SolutionsHeader from '.';

export default {
  title: 'Help and Knowledge SolutionsHeader',
  component: SolutionsHeader,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <SolutionsHeader
            resultsNum={9}
            resultsMax={helpSolutions.length}
            setQuery={(query: string) => null}
            query=""
          />
        </Route>
      </MemoryRouter>
    )
  ]
} as Meta<typeof SolutionsHeader>;

export const Default = () => (
  <MemoryRouter initialEntries={['/help-and-knowledge/operational-solutions']}>
    <Route path="/help-and-knowledge/operational-solutions">
      <SolutionsHeader
        resultsNum={9}
        resultsMax={helpSolutions.length}
        setQuery={(query: string) => null}
        query=""
      />
    </Route>
  </MemoryRouter>
);
