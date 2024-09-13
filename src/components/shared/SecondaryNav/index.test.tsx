import React from 'react';
import { render, screen } from '@testing-library/react';

import { NavLink, SecondaryNav } from './index';

describe('The Secondary Nav component', () => {
  it('renders without crashing', () => {
    render(
      <SecondaryNav>
        <NavLink to="/">Test</NavLink>
      </SecondaryNav>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
