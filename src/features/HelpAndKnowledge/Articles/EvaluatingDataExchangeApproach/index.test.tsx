import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import EvaluatingDataExchangeApproach from './index';

describe('SixPagerMeeting', () => {
  it('matches the snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/evaluating-data-exchange-approach',
          element: <EvaluatingDataExchangeApproach />
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/evaluating-data-exchange-approach'
        ]
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
