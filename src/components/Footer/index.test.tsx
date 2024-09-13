import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import Footer from './index';

describe('The Footer component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/report-a-problem']}>
        <Route path="/report-a-problem">
          <Footer />
        </Route>
      </MemoryRouter>
    );

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
