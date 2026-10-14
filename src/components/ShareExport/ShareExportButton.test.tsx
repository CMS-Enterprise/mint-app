import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ShareExportButton from './ShareExportButton';

describe('ShareExportButton', () => {
  it('opens the send message page from the menu', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area',
          element: (
            <ShareExportButton modelID="123" setStatusMessage={() => null} />
          )
        },
        {
          path: '/models/:modelID/collaboration-area/send-message-to-followers',
          element: <div>send message page</div>
        }
      ],
      { initialEntries: ['/models/123/collaboration-area'] }
    );

    render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await user.click(screen.getByRole('button', { name: '...' }));
    await user.click(
      screen.getByRole('button', { name: 'Send a message to followers' })
    );

    expect(router.state.location.pathname).toBe(
      '/models/123/collaboration-area/send-message-to-followers'
    );
  });
});
