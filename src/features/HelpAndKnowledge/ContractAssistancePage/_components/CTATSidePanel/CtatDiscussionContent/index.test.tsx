import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CtatDiscussionPoster,
  GetCtatDiscussionsQuery
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';
import setup from 'tests/util';
import { vi } from 'vitest';

import CtatDiscussionContent from './index';

const toastSuccess = vi.hoisted(() => vi.fn());
vi.mock('components/ToastSuccess', () => ({ default: toastSuccess }));

const saveMessage = vi.fn(async () => {});
const cancelMessage = vi.fn();

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
  beforeEach(() => {
    toastSuccess.mockClear();
  });

  it('shows an info banner when there are no messages', () => {
    setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        discussions={[]}
        discussionsLoading={false}
        isClosed={false}
        onSaveMessage={saveMessage}
        onCancelMessage={cancelMessage}
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
        isClosed={false}
        onSaveMessage={saveMessage}
        onCancelMessage={cancelMessage}
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
        isClosed={false}
        onSaveMessage={saveMessage}
        onCancelMessage={cancelMessage}
      />
    );

    expect(screen.getByText('Today, 3:34 AM')).toBeInTheDocument();
    expect(screen.queryByText('Today at 3:34 AM')).not.toBeInTheDocument();
  });

  it('shows the message form after the messages and validates before saving', async () => {
    saveMessage.mockClear();
    cancelMessage.mockClear();
    const { user } = setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        discussions={discussions}
        discussionsLoading={false}
        isClosed={false}
        onSaveMessage={saveMessage}
        onCancelMessage={cancelMessage}
      />
    );

    const form = screen.getByRole('form', { name: 'Add a message' });
    const lastMessage = screen.getAllByRole('article').at(-1);
    expect(lastMessage?.compareDocumentPosition(form)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(form).toHaveTextContent('All fields marked with * are required.');
    expect(form).toHaveTextContent(
      'This message will only be visible to the original ticket requester and the CTAT Admin team.'
    );

    const input = screen.getByRole('textbox', { name: /Type your message/ });
    const saveButton = screen.getByRole('button', { name: 'Save message' });
    expect((input as HTMLTextAreaElement).labels?.[0]).toHaveClass(
      'text-normal'
    );
    expect(input).toHaveAttribute('required');
    expect(saveButton).toBeDisabled();

    await user.type(input, '   ');
    expect(saveButton).toBeDisabled();
    await user.clear(input);
    await user.type(input, '  A new message  ');
    expect(saveButton).toBeEnabled();

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    expect(cancelButton).toHaveClass('usa-button--outline');
    await user.click(cancelButton);
    expect(input).toHaveValue('');
    expect(saveButton).toBeDisabled();
    expect(cancelMessage).toHaveBeenCalledTimes(1);

    const message = '\n  First line\n\nSecond line  \n';
    await user.type(input, message);
    await user.click(saveButton);
    await waitFor(() => {
      expect(saveMessage).toHaveBeenCalledWith(message.trim());
      expect(input).toHaveValue('');
    });
    expect(saveButton).toBeDisabled();
    expect(toastSuccess).toHaveBeenCalledTimes(1);
    render(toastSuccess.mock.calls[0][0]);
    expect(screen.getByText('CTAT-001', { selector: 'strong' })).toBeVisible();
    expect(document.body).toHaveTextContent(
      'You added a message to the discussion for a contract assistance ticket (CTAT-001).'
    );
  });

  it('renders saved line breaks in message content', () => {
    const content = 'First line\n\nSecond line';
    setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        discussions={[{ ...discussions[0], content }]}
        discussionsLoading={false}
        isClosed={false}
        onSaveMessage={saveMessage}
        onCancelMessage={cancelMessage}
      />
    );

    const message = screen.getByText(/First line/);
    expect(message).toHaveClass('mint-ctat-discussion-message__content');
    expect(message.textContent).toBe(content);
  });

  it('hides the message form on a closed ticket', () => {
    setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        discussions={discussions}
        discussionsLoading={false}
        isClosed
        onSaveMessage={saveMessage}
        onCancelMessage={cancelMessage}
      />
    );

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.queryByRole('form', { name: 'Add a message' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Save message' })).toBeNull();
  });

  it('keeps the draft when saving fails', async () => {
    const failingSave = vi.fn(async () => {
      throw new Error('Save failed');
    });
    const { user } = setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        discussions={[]}
        discussionsLoading={false}
        isClosed={false}
        onSaveMessage={failingSave}
        onCancelMessage={cancelMessage}
      />
    );

    const input = screen.getByRole('textbox', { name: /Type your message/ });
    await user.type(input, 'Keep this draft');
    await user.click(screen.getByRole('button', { name: 'Save message' }));

    await waitFor(() => expect(failingSave).toHaveBeenCalledTimes(1));
    expect(toastSuccess).not.toHaveBeenCalled();
    expect(input).toHaveValue('Keep this draft');
    expect(screen.getByRole('button', { name: 'Save message' })).toBeEnabled();
  });

  it('shows the latest two messages and toggles earlier messages in chronological order', async () => {
    const { user } = setup(
      <CtatDiscussionContent
        ticketNumber="CTAT-001"
        discussions={discussions}
        discussionsLoading={false}
        isClosed={false}
        onSaveMessage={saveMessage}
        onCancelMessage={cancelMessage}
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
    expect(
      screen
        .getAllByRole('article')[2]
        .compareDocumentPosition(
          screen.getByRole('form', { name: 'Add a message' })
        )
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

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
        isClosed={false}
        onSaveMessage={saveMessage}
        onCancelMessage={cancelMessage}
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
        isClosed={false}
        onSaveMessage={saveMessage}
        onCancelMessage={cancelMessage}
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
