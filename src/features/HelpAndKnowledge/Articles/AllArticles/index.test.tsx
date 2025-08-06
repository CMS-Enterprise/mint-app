import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import AllArticles from '.';

describe('The AllArticles component', () => {
  it('renders correct Getting Started category', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/articles',
          element: (
            <MockedProvider mocks={[]} addTypename={false}>
              <AllArticles />
            </MockedProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/articles?category=getting-started'
        ]
      }
    );

    const { getAllByText } = render(<RouterProvider router={router} />);

    expect(getAllByText('Getting started')[0]).toBeInTheDocument();
  });

  it('renders correct IT Implementation category', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/articles',
          element: (
            <MockedProvider mocks={[]} addTypename={false}>
              <AllArticles />
            </MockedProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/articles?category=it-implementation'
        ]
      }
    );

    const { getAllByText } = render(<RouterProvider router={router} />);

    expect(getAllByText('IT implementation')[0]).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MockedProvider mocks={[]} addTypename={false}>
              <AllArticles />
            </MockedProvider>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
