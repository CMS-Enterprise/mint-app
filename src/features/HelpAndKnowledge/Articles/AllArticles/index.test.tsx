import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import AllArticles from '.';

describe('The AllArticles component', () => {
  it('renders correct Getting Started category', async () => {
    const { getAllByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/articles?category=getting-started'
        ]}
      >
        <Route path="/help-and-knowledge/articles">
          <MockedProvider mocks={[]} addTypename={false}>
            <AllArticles />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(getAllByText('Getting started')[0]).toBeInTheDocument();
  });

  it('renders correct IT Implementation category', async () => {
    const { getAllByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/articles?category=it-implementation'
        ]}
      >
        <Route path="/help-and-knowledge/articles">
          <MockedProvider mocks={[]} addTypename={false}>
            <AllArticles />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(getAllByText('IT implementation')[0]).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MockedProvider mocks={[]} addTypename={false}>
          <AllArticles />
        </MockedProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
