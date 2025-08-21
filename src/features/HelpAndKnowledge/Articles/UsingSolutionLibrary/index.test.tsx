import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import UsingSolutionLibrary from '.';

describe('UsingSolutionLibrary', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/using-solution-library',
          element: <UsingSolutionLibrary />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/using-solution-library']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
