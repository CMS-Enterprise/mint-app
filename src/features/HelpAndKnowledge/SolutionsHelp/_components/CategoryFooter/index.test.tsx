import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import CategoryFooter from './index';

describe('Operation Solutio Category Footer', () => {
  it('rendered all categories minus current category', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/categories/communication-tools',
          element: <CategoryFooter />
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/categories/communication-tools'
        ]
      }
    );

    const { queryByText } = render(<RouterProvider router={router} />);
    expect(queryByText('Communication Tools')).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: <CategoryFooter />
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
