import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import AddCustomSolution from '.';

describe('AddCustomSolution', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/add-custom-solution',
          element: <AddCustomSolution />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/add-custom-solution']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
