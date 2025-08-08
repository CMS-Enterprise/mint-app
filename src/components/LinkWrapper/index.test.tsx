import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import UswdsReactLink from 'components/LinkWrapper';

describe('UswdsReactLink', () => {
  it('renders without errors', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <UswdsReactLink data-testid="test-link" to="/">
              Link
            </UswdsReactLink>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByTestId } = render(<RouterProvider router={router} />);

    expect(getByTestId('test-link')).toBeInTheDocument();
  });
});
