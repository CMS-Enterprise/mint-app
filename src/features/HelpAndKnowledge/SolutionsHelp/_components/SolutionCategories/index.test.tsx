import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';

import SolutionCategories from './index';

describe('Solution Help Categories', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/help-and-knowledge']}>
        <Routes>
          <Route
            path="/help-and-knowledge"
            element={<SolutionCategories  />}
          />
        </Routes>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
