import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import OperationalPlanning from '.';

describe('Operational planning for Medicare Advantage and Part D models', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <OperationalPlanning />
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
