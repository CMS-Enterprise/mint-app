import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import MTOOptionsPanel from '.';

describe('MTOOptionsPanel', () => {
  it('renders correctly', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: <MTOOptionsPanel />
        }
      ],
      {
        initialEntries: [
          '/models/123/collaboration-area/model-to-operations/matrix'
        ]
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
