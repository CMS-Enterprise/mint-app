import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { commonWaiversMockData } from 'tests/mock/general';
import setup from 'tests/util';

import WaiverCardGroup from './index';

describe('Waiver Card Group', () => {
  it('rendered all correct information even after pagination', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/waiver-library',
          element: <WaiverCardGroup commonWaivers={commonWaiversMockData} />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/waiver-library']
      }
    );

    const { getByText, queryByLabelText } = setup(
      <RouterProvider router={router} />
    );

    // Waivers visible on page one
    expect(getByText('super long survey name Waiver 1')).toBeInTheDocument();
    expect(getByText('short Waiver 2')).toBeInTheDocument();
    expect(getByText('Waiver 3')).toBeInTheDocument();

    // No page 2
    expect(queryByLabelText('Page 2')).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/waiver-library',
          element: <WaiverCardGroup commonWaivers={commonWaiversMockData} />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/waiver-library']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
