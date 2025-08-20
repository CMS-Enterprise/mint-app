import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ModelStatus } from 'gql/generated/graphql';

import CollaborationStatusBanner from './index';

describe('CollaborationStatusBanner', () => {
  it('renders all main elements', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <CollaborationStatusBanner
              modelID="abc123"
              status={ModelStatus.PLAN_DRAFT}
              mostRecentEdit="2023-10-01T12:00:00Z"
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
});
