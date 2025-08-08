import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { MtoCommonSolutionSubject } from 'gql/generated/graphql';

import { operationalSolutionCategoryMap } from '../../solutionsMap';

import SolutionsTag from './index';

describe('Operation Solution Help Tag', () => {
  it('rendered correct information without query', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <SolutionsTag
              route={operationalSolutionCategoryMap.data}
              category={MtoCommonSolutionSubject.DATA}
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/operational-solutions']
      }
    );

    const { getByTestId } = render(<RouterProvider router={router} />);

    const tag = getByTestId('solutions-tag');

    expect(tag).toBeInTheDocument();
    expect(tag).toHaveTextContent('Data');
    expect(tag).toHaveAttribute(
      'href',
      '/help-and-knowledge/operational-solutions?category=DATA'
    );
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <SolutionsTag
              route={operationalSolutionCategoryMap.data}
              category={MtoCommonSolutionSubject.DATA}
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/operational-solutions']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
