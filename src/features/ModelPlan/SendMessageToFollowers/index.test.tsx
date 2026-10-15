import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { stubProseMirrorLayout } from 'tests/util';

import SendMessageToFollowers from './index';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';
const path = `/models/${modelID}/collaboration-area/send-message-to-followers`;

const renderPage = (onSend = vi.fn()) => {
  const router = createMemoryRouter(
    [
      {
        path: '/models/:modelID/collaboration-area/send-message-to-followers',
        element: <SendMessageToFollowers onSend={onSend} />
      },
      {
        path: '/models/:modelID/collaboration-area',
        element: <div>collaboration area</div>
      }
    ],
    { initialEntries: [path] }
  );

  return { router, ...render(<RouterProvider router={router} />) };
};

describe('SendMessageToFollowers', () => {
  beforeAll(() => {
    stubProseMirrorLayout();
  });

  it('renders the page copy and a disabled send button', async () => {
    renderPage();

    expect(
      screen.getByRole('heading', { name: 'Send a message to followers' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'If necessary, include a brief description to help other users understand what this date is and why it matters for your model.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', {
        name: 'Don’t send a message and return to collaboration area'
      })
    ).toHaveLength(2);

    await waitFor(() =>
      expect(
        screen.getByRole('textbox', { name: /Model update message/ })
      ).toBeInTheDocument()
    );
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Link' })).toBeInTheDocument();
  });

  it('passes the editor HTML to onSend', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    renderPage(onSend);

    const editor = await screen.findByRole('textbox', {
      name: /Model update message/
    });
    await user.click(editor);
    await user.keyboard('Model update');

    const sendButton = screen.getByRole('button', { name: 'Send message' });
    await waitFor(() => expect(sendButton).not.toBeDisabled());
    await user.click(sendButton);

    expect(onSend).toHaveBeenCalledWith('<p>Model update</p>');
  });

  it('disables send again when the message is cleared', async () => {
    const user = userEvent.setup();
    renderPage();

    const editor = await screen.findByRole('textbox', {
      name: /Model update message/
    });
    await user.click(editor);
    await user.keyboard('Model update');

    const sendButton = screen.getByRole('button', { name: 'Send message' });
    await waitFor(() => expect(sendButton).not.toBeDisabled());

    await user.keyboard('{Control>}a{/Control}{Backspace}');

    await waitFor(() => expect(sendButton).toBeDisabled());
  });

  it('returns to the collaboration area', async () => {
    const user = userEvent.setup();
    const { router } = renderPage();

    await user.click(
      screen.getAllByRole('button', {
        name: 'Don’t send a message and return to collaboration area'
      })[0]
    );

    expect(router.state.location.pathname).toBe(
      `/models/${modelID}/collaboration-area`
    );
  });
});
