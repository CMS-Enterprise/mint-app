import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import ModelSolutionImplementation from '.';

describe('ModelSolutionImplementation', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/model-and-solution-implementation',
          element: <ModelSolutionImplementation />
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/model-and-solution-implementation'
        ]
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
