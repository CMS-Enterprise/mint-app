import React from 'react';
import { screen } from '@testing-library/react';
import {
  CtatDiscussionPoster,
  GetCtatDiscussionsQuery
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';
import setup from 'tests/util';

import CtatDiscussionContent from './index';

const discussions: GetCtatDiscussionsQuery['discussions'] = [
  {
    __typename: 'CTATDiscussion',
    id: '3',
    ticketID: 'ticket',
    content: 'Newest message',
    posterRole: CtatDiscussionPoster.ADMIN,
    createdBy: 'admin',
    createdByUserAccount: {
      __typename: 'UserAccount',
      givenName: 'Jane',
      familyName: 'Smith'
    },
    createdDts: DateTime.local().minus({ days: 1 }).toISO() ?? ''
  },
  {
    __typename: 'CTATDiscussion',
    id: '2',
    ticketID: 'ticket',
    content: 'Second message',
    posterRole: CtatDiscussionPoster.REQUESTER,
    createdBy: 'requester',
    createdByUserAccount: {
      __typename: 'UserAccount',
      givenName: 'Luke',
      familyName: 'Skywalker'
    },
    createdDts: DateTime.local().minus({ days: 2 }).toISO() ?? ''
  },
  {
    __typename: 'CTATDiscussion',
    id: '1',
    ticketID: 'ticket',
    content: 'Oldest message',
    posterRole: CtatDiscussionPoster.REQUESTER,
    createdBy: 'Luke',
    createdByUserAccount: {
      __typename: 'UserAccount',
      givenName: 'Luke',
      familyName: 'Skywalker'
    },
    createdDts: DateTime.local().minus({ days: 3 }).toISO() ?? ''
  }
];

describe('CtatDiscussionContent', () => {
  it('shows an info banner when there are no messages', () => {
    setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        discussions={[]}
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
  ])('shows the count and messages for %i messages', (messageCount, label) => {
    setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        discussions={discussions.slice(0, messageCount)}
        discussionsLoading={false}
      />
    );

    expect(screen.getByText(label)).toHaveClass('text-bold');
    expect(
      screen.queryByText(/^There are not yet any messages/)
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(messageCount);
    expect(
      document.querySelectorAll('.mint-ctat-discussion-message__connector')
    ).toHaveLength(messageCount);
    expect(
      screen.queryByRole('button', { name: 'Show earlier messages' })
    ).not.toBeInTheDocument();
  });

  it('shows Today with a comma in the message list', () => {
    const postedToday = DateTime.local()
      .set({ hour: 3, minute: 34, second: 0, millisecond: 0 })
      .toISO();
    setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        discussions={[{ ...discussions[0], createdDts: postedToday ?? '' }]}
        discussionsLoading={false}
      />
    );

    expect(screen.getByText('Today, 3:34 AM')).toBeInTheDocument();
    expect(screen.queryByText('Today at 3:34 AM')).not.toBeInTheDocument();
  });

  it('shows the latest two messages and toggles earlier messages in chronological order', async () => {
    const { user } = setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        discussions={discussions}
        discussionsLoading={false}
      />
    );

    expect(screen.getByText('3 messages')).toBeInTheDocument();
    expect(
      screen.getByText('Showing the most recent 2 messages')
    ).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(
      document.querySelectorAll('.mint-ctat-discussion-message__connector')
    ).toHaveLength(2);
    expect(screen.getAllByRole('article')[0]).toHaveTextContent(
      'Second message'
    );
    expect(screen.getAllByRole('article')[1]).toHaveTextContent(
      'Newest message'
    );
    expect(screen.queryByText('Oldest message')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('CTAT Admin')).toBeInTheDocument();
    expect(screen.getByText('Requester')).toBeInTheDocument();
    expect(screen.getByText('Yesterday')).toBeInTheDocument();
    expect(screen.getByText('JS')).toBeInTheDocument();

    const showButton = screen.getByRole('button', {
      name: 'Show earlier messages'
    });
    expect(showButton).toHaveAttribute('aria-expanded', 'false');
    await user.click(showButton);

    expect(screen.getByText('Showing all messages')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(
      document.querySelectorAll('.mint-ctat-discussion-message__connector')
    ).toHaveLength(3);
    expect(screen.getAllByRole('article')[0]).toHaveTextContent(
      'Oldest message'
    );
    expect(screen.getAllByRole('article')[1]).toHaveTextContent(
      'Second message'
    );
    expect(screen.getAllByRole('article')[2]).toHaveTextContent(
      'Newest message'
    );

    const hideButton = screen.getByRole('button', {
      name: 'Hide earlier messages'
    });
    expect(hideButton).toHaveAttribute('aria-expanded', 'true');
    await user.click(hideButton);

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(
      document.querySelectorAll('.mint-ctat-discussion-message__connector')
    ).toHaveLength(2);
    expect(screen.queryByText('Oldest message')).not.toBeInTheDocument();
  });

  it('does not show the empty banner while loading or after an error', () => {
    const { rerender } = setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        discussions={[]}
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
        discussions={[]}
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
