import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import OperationalSolutionCategories from 'data/operationalSolutionCategories';

import { operationalSolutionCategoryMap } from '../../solutionsMap';

import SolutionsTag from './index';

describe('Operation Solution Help Tag', () => {
  it('rendered correct information without query', () => {
    const { getByLabelText } = render(
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
    );

    const tag = getByLabelText('Category tag link');

    expect(tag).toBeInTheDocument();
    expect(tag).toHaveTextContent('Data reporting');
    expect(tag).toHaveAttribute(
      'href',
      '/help-and-knowledge/operational-solutions/categories/data-reporting'
    );
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
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
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
