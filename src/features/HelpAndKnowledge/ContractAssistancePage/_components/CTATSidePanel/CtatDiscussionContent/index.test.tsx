import React from 'react';
import { screen } from '@testing-library/react';
import setup from 'tests/util';

import CtatDiscussionContent from './index';

describe('CtatDiscussionContent', () => {
  it('shows an info banner when there are no messages', () => {
    setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        messageCount={0}
        discussionsLoading={false}
      />
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Discussion' })
    ).toBeInTheDocument();
    expect(screen.getByText('Ticket CTAT-001')).toHaveClass('text-base-dark');
    expect(
      screen
        .getByText(
          'There are not yet any messages about this ticket. Add a message to start a discussion.'
        )
        .closest('.usa-alert')
    ).toHaveClass('usa-alert--info');
    expect(screen.queryByText('0 messages')).not.toBeInTheDocument();
  });

  it.each([
    [1, '1 message'],
    [2, '2 messages']
  ])('shows the count for %i messages', (messageCount, label) => {
    setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        messageCount={messageCount}
        discussionsLoading={false}
      />
    );

    expect(screen.getByText(label)).toHaveClass('text-bold');
    expect(
      screen.queryByText(/^There are not yet any messages/)
    ).not.toBeInTheDocument();
  });

  it('does not show the empty banner while loading or after an error', () => {
    const { rerender } = setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        messageCount={0}
        discussionsLoading
      />
    );

    expect(
      screen.getByRole('progressbar', { name: 'Loading discussion…' })
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/^There are not yet any messages/)
    ).not.toBeInTheDocument();

    rerender(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        messageCount={0}
        discussionsLoading={false}
        discussionsError={new Error('Failed to load')}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Discussion could not be loaded.'
    );
    expect(
      screen.queryByText(/^There are not yet any messages/)
    ).not.toBeInTheDocument();
  });
});
