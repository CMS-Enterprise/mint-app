import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { MtoCommonSolutionSubject } from 'gql/generated/graphql';

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
            category={MtoCommonSolutionSubject.DATA}
          />
        </Route>
      </MemoryRouter>
    );

    const tag = getByTestId('solutions-tag');

    expect(tag).toBeInTheDocument();
    expect(tag).toHaveTextContent('Data');
    expect(tag).toHaveAttribute(
      'href',
      '/help-and-knowledge/operational-solutions?category=DATA'
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
            category={MtoCommonSolutionSubject.DATA}
          />
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
