import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
    render(
      <MemoryRouter initialEntries={['/report-a-problem']}>
        <Routes>
          <Route
            path="/report-a-problem"
            element={<Footer  />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
