import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import StillNeedMTOHelp from '.';

describe('StillNeedMTOHelp', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <StillNeedMTOHelp />
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
