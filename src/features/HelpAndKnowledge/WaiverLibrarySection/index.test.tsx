import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import WaiverLibrarySection from '.';

describe('WaiverLibrarySection', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: <WaiverLibrarySection />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
