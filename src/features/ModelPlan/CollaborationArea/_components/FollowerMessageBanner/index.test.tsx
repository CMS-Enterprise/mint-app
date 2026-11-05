import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import FollowerMessageBanner from './index';

describe('FollowerMessageBanner', () => {
  it('links to the send message page', () => {
    render(
      <MemoryRouter>
        <FollowerMessageBanner modelID="123" />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Have an update or announcement about your model?', {
        exact: false
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Send a message to followers' })
    ).toHaveAttribute(
      'href',
      '/models/123/collaboration-area/send-message-to-followers'
    );
  });
});
