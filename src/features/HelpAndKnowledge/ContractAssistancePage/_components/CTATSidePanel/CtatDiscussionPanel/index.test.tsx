import React from 'react';
import { screen } from '@testing-library/react';
import setup from 'tests/util';
import { vi } from 'vitest';

import CtatDiscussionPanel from './index';

describe('CtatDiscussionPanel', () => {
  it('shows the discussion skeleton and calls close when going back', async () => {
    const closeModal = vi.fn();
    const { user } = setup(<CtatDiscussionPanel closeModal={closeModal} />);

    expect(screen.getByTestId('ctat-discussion-sidepanel')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Back to ticket details' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
