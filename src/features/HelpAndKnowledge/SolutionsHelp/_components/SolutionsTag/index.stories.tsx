import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { OperationalSolutionCategories } from 'features/ModelPlan/TaskList/ITSolutions/operationalSolutionCategories';

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
            route={operationalSolutionCategoryMap.data}
            category={OperationalSolutionCategories.DATA}
          />
        </Route>
      </MemoryRouter>
    )
  ]
} as Meta<typeof SolutionsTag>;

export const Default = () => (
  <MemoryRouter initialEntries={['/help-and-knowledge/operational-solutions']}>
    <Route path="/help-and-knowledge/operational-solutions">
      <SolutionsTag
        route={operationalSolutionCategoryMap.data}
        category={OperationalSolutionCategories.DATA}
      />
    </Route>
  </MemoryRouter>
);
