import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import Footer from './index';

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: false
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

describe('The Footer component', () => {
  it('renders without crashing', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/report-a-problem',
          element: <Footer />
        }
      ],
      {
        initialEntries: ['/report-a-problem']
      }
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
