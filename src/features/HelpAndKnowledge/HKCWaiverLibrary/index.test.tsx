import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { allCommonWaiversMocks } from 'tests/mock/general';

import HKCWaiverLibrary from '.';

describe('HKC Waiver library Component', () => {
  it('renders correctly and matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/waiver-library',
          element: <HKCWaiverLibrary />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/waiver-library']
      }
    );

    const { getByTestId, findByRole, asFragment } = render(
      <MockedProvider mocks={[...allCommonWaiversMocks]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));
    await findByRole('navigation', { name: /pagination/i });

    expect(asFragment()).toMatchSnapshot();
  });
});
