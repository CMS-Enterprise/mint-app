import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import TwoPagerMeeting from './index';

describe('TwoPagerMeeting', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/about-2-page-concept-papers-and-review-meetings',
          element: <TwoPagerMeeting />
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/about-2-page-concept-papers-and-review-meetings'
        ]
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
