import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
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
        <Route path="/help-and-knowledge/operational-solutions/categories/communication-tools">
          <CategoryFooter />
        </Route>
      </MemoryRouter>
    );
    expect(queryByText('Communication Tools')).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <CategoryFooter />
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
