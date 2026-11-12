import React from 'react';
import { screen } from '@testing-library/react';
import setup from 'tests/util';

import CtatDiscussionContent from './index';

describe('CtatDiscussionContent', () => {
  it('shows the discussion heading and ticket number', () => {
    setup(<CtatDiscussionContent ticketNumber="CTAT-001" />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Discussion' })
    ).toBeInTheDocument();
    expect(screen.getByText('Ticket CTAT-001')).toHaveClass('text-base-dark');
  });
});
