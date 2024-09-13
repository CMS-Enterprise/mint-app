import React from 'react';
import { MemoryRouter } from 'react-router-dom';
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
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
