import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import MessageProvider from 'contexts/MessageContext';

import Status from './index';

describe('Model Plan Status Update page', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/status',
          element: (
            <MessageProvider>
              <Status />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/status'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
