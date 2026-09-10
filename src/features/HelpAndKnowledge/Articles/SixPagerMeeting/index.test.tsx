import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import SixPagerMeeting from './index';

describe('SixPagerMeeting', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <SixPagerMeeting />
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
