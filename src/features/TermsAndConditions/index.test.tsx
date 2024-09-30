import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import TermsAndConditions from './index';

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => {},
        logout: async () => {}
      }
    };
  }
}));

describe('The Terms & Conditions page', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <TermsAndConditions />
      </MemoryRouter>
    );
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <TermsAndConditions />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
