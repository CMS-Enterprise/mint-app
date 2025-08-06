import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';

import CategoryFooter from './index';

describe('Operation Solutio Category Footer', () => {
  it('rendered all categories minus current category', () => {
    const { queryByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/categories/communication-tools'
        ]}
      >
        <Routes>
          <Route
            path="/help-and-knowledge/operational-solutions/categories/communication-tools"
            element={<CategoryFooter  />}
          />
        </Routes>
      </MemoryRouter>
    );
    expect(queryByText('Communication Tools')).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Routes>
          <Route
            path="/help-and-knowledge/operational-solutions"
            element={<CategoryFooter  />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
