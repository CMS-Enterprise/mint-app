import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { OperationalSolutionCategories } from 'features/ModelPlan/TaskList/ITSolutions/operationalSolutionCategories';

import { operationalSolutionCategoryMap } from '../../solutionsMap';

import SolutionsTag from './index';

describe('Operation Solution Help Tag', () => {
  it('rendered correct information without query', () => {
    const { getByTestId } = render(
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
    );

    const tag = getByTestId('solutions-tag');

    expect(tag).toBeInTheDocument();
    expect(tag).toHaveTextContent('Data');
    expect(tag).toHaveAttribute(
      'href',
      '/help-and-knowledge/operational-solutions?category=data'
    );
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
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
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
