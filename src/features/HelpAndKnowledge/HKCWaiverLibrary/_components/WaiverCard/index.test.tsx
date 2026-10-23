import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { commonWaiversMockData } from 'tests/mock/general';
import MockedProvider from 'tests/MockedProvider';

import WaiverCard from './index';

describe('Waiver Card', () => {
  it('rendered all correct information', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/waiver-library',
          element: (
            <MockedProvider mocks={[]}>
              <WaiverCard waiver={commonWaiversMockData[0]} />
            </MockedProvider>
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/waiver-library']
      }
    );

    const { getByText } = render(<RouterProvider router={router} />);

    expect(getByText('super long survey name Waiver 1')).toBeInTheDocument();
    expect(getByText('Medicaid waiver')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/waiver-library',
          element: (
            <MockedProvider mocks={[]}>
              <WaiverCard waiver={commonWaiversMockData[0]} />
            </MockedProvider>
          )
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
