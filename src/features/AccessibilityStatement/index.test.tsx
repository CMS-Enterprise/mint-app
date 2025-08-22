import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import AccessibilityStatement from '.';

describe('AccessibilityStatement', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <AccessibilityStatement />
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
