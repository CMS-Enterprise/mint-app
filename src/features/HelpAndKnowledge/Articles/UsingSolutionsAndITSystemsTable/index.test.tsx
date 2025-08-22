import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import UsingSolutionsAndITSystemsTable from '.';

describe('UsingSolutionsAndITSystemsTable', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <UsingSolutionsAndITSystemsTable />
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
