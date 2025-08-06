import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ModelStatus } from 'gql/generated/graphql';

import ReadViewStatusBanner from './index';

describe('ReadViewStatusBanner', () => {
  it('renders correctly and matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ReadViewStatusBanner
              modelID="123"
              status={ModelStatus.PLAN_DRAFT}
              hasEditAccess
              mostRecentEdit="2024-05-01T12:00:00Z"
              changeHistoryLink
              className="test-class"
            />
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

  it('renders without edit access and without change history link', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ReadViewStatusBanner
              modelID="123"
              status={ModelStatus.PLAN_DRAFT}
              hasEditAccess={false}
              mostRecentEdit="2024-05-01T12:00:00Z"
              changeHistoryLink={false}
            />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    render(<RouterProvider router={router} />);

    expect(
      screen.queryByRole('link', { name: /Edit model information/i })
    ).not.toBeInTheDocument();
  });
});
