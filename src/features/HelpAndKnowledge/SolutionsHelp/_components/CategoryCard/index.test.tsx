import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { MtoCommonSolutionSubject } from 'gql/generated/graphql';

import CategoryCard from './index';

describe('Operational Solution Category Card', () => {
  it('rendered category name and link', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <CategoryCard categoryKey={MtoCommonSolutionSubject.DATA} />
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText } = render(<RouterProvider router={router} />);
    expect(getByText('Data')).toBeInTheDocument();
    expect(getByText('Learn more')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <CategoryCard categoryKey={MtoCommonSolutionSubject.DATA} />
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
