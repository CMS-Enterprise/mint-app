import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import MailboxAndTeamMemberModal from '.';

const contact: SolutionContactType = {
  __typename: 'MTOCommonSolutionContact',
  id: '123',
  name: 'Aliza Kim',
  email: 'aliza.kim@cms.hhs.gov',
  mailboxTitle: '',
  mailboxAddress: '',
  isTeam: false,
  role: 'Project Lead',
  isPrimary: true,
  receiveEmails: false
};

const mocks = [...possibleSolutionsMock];

describe('MailboxAndTeamMemberModal Component', () => {
  it('should render add team mailbox context when render', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <MailboxAndTeamMemberModal
              isOpen
              closeModal={() => {}}
              contact={contact}
              mode="addTeamMailbox"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MessageProvider>
          <RouterProvider router={router} />
        </MessageProvider>
      </MockedProvider>
    );
    expect(getByText('Add a team mailbox')).toBeInTheDocument();
    expect(queryByText('Add a team member')).not.toBeInTheDocument();
    expect(queryByText('Edit a team member')).not.toBeInTheDocument();
    expect(queryByText('Edit a team mailbox')).not.toBeInTheDocument();
  });

  it('should render add team member context when render', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <MailboxAndTeamMemberModal
              isOpen
              closeModal={() => {}}
              contact={contact}
              mode="addTeamMember"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MessageProvider>
          <RouterProvider router={router} />
        </MessageProvider>
      </MockedProvider>
    );
    expect(getByText('Add a team member')).toBeInTheDocument();
    expect(queryByText('Add a team mailbox')).not.toBeInTheDocument();
    expect(queryByText('Edit a team member')).not.toBeInTheDocument();
    expect(queryByText('Edit a team mailbox')).not.toBeInTheDocument();
  });

  it('should render edit team mailbox context when render', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <MailboxAndTeamMemberModal
              isOpen
              closeModal={() => {}}
              contact={contact}
              mode="editTeamMailbox"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MessageProvider>
          <RouterProvider router={router} />
        </MessageProvider>
      </MockedProvider>
    );
    expect(getByText('Edit a team mailbox')).toBeInTheDocument();
    expect(queryByText('Edit a team member')).not.toBeInTheDocument();
    expect(queryByText('Add a team mailbox')).not.toBeInTheDocument();
    expect(queryByText('Add a team member')).not.toBeInTheDocument();
  });

  it('should render edit team member context when render', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <MailboxAndTeamMemberModal
              isOpen
              closeModal={() => {}}
              contact={contact}
              mode="editTeamMember"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MessageProvider>
          <RouterProvider router={router} />
        </MessageProvider>
      </MockedProvider>
    );
    expect(getByText('Edit a team member')).toBeInTheDocument();
    expect(queryByText('Add a team mailbox')).not.toBeInTheDocument();
    expect(queryByText('Add a team member')).not.toBeInTheDocument();
    expect(queryByText('Edit a team mailbox')).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <MailboxAndTeamMemberModal
              isOpen
              closeModal={() => {}}
              contact={contact}
              mode="addTeamMember"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MessageProvider>
          <RouterProvider router={router} />
        </MessageProvider>
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
