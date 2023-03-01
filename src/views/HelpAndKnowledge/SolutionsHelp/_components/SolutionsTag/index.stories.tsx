import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ComponentMeta } from '@storybook/react';

import OperationalSolutionCategories from 'data/operationalSolutionCategories';

import { operationalSolutionCategoryMap } from '../../solutionsMap';

import SolutionsTag from '.';

export default {
  title: 'Help and Knowledge SolutionsTag',
  component: SolutionsTag,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <SolutionsTag
            route={operationalSolutionCategoryMap.dataReporting}
            category={OperationalSolutionCategories.DATA_REPORTING}
          />
        </Route>
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof SolutionsTag>;

export const Default = () => (
  <MemoryRouter initialEntries={['/help-and-knowledge/operational-solutions']}>
    <Route path="/help-and-knowledge/operational-solutions">
      <SolutionsTag
        route={operationalSolutionCategoryMap.dataReporting}
        category={OperationalSolutionCategories.DATA_REPORTING}
      />
    </Route>
  </MemoryRouter>
);
