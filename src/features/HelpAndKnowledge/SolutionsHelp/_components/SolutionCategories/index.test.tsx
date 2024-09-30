import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import SolutionCategories from './index';

describe('Solution Help Categories', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/help-and-knowledge']}>
        <Route path="/help-and-knowledge">
          <SolutionCategories />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
