import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { NavLink, SecondaryNav } from './index';

describe('The Secondary Nav component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SecondaryNav>
          <NavLink to="/">Test</NavLink>
        </SecondaryNav>
      </MemoryRouter>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
