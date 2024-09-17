import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import AllArticles from '.';

describe('The AllArticles component', () => {
  it('renders correct Getting Started category', async () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/articles?category=getting-started'
        ]}
      >
        <Route path="/help-and-knowledge/articles">
          <AllArticles />
        </Route>
      </MemoryRouter>
    );

    expect(getByText('Getting started')).toBeInTheDocument();
  });

  it('renders correct IT Implementation category', async () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/articles?category=it-implementation'
        ]}
      >
        <Route path="/help-and-knowledge/articles">
          <AllArticles />
        </Route>
      </MemoryRouter>
    );

    expect(getByText('IT implementation')).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AllArticles />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
