import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import NotFound from './index';

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => ({
          name: 'John Doe'
        }),
        logout: async () => {}
      }
    };
  }
}));

describe('The Not Found Page', () => {
  it('renders without crashing', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <NotFound />
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    render(<RouterProvider router={router} />);
    expect(screen.getByText('This page cannot be found.')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <NotFound />
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
