import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import TeamMailboxForm from './index';

const mocks = [...possibleSolutionsMock];

const team: SolutionContactType = {
  __typename: 'MTOCommonSolutionContact',
  id: '123',
  name: 'Test Last',
  email: 'email@email.com',
  mailboxTitle: 'Mint Team',
  mailboxAddress: 'mint-team@email.com',
  isTeam: true,
  isPrimary: false,
  role: null,
  receiveEmails: false,
  userAccount: {
    __typename: 'UserAccount',
    id: '123',
    username: 'AWER'
  }
};

describe('Team mailbox point of contact form', () => {
  it('should render team mailbox info accordingly', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <TeamMailboxForm
                mode="editTeamMailbox"
                closeModal={() => {}}
                teamMailbox={team}
                setDisableButton={() => {}}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByTestId('team-mailbox-address')).toHaveValue(
        'mint-team@email.com'
      );
      expect(getByTestId('team-mailbox-title')).toHaveValue('Mint Team');
      expect(getByTestId('isPrimary')).not.toBeChecked();
      expect(getByTestId('receiveEmails')).not.toBeChecked();
    });
  });

  it('should render team mailbox info accordingly', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <TeamMailboxForm
                mode="editTeamMailbox"
                closeModal={() => {}}
                teamMailbox={{ ...team, isPrimary: true, receiveEmails: true }}
                setDisableButton={() => {}}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]
      }
    );

    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByTestId('isPrimary')).toBeChecked();
      expect(getByTestId('receiveEmails')).toBeChecked();
    });
  });

  it('should matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <TeamMailboxForm
                mode="addTeamMailbox"
                closeModal={() => {}}
                teamMailbox={team}
                setDisableButton={() => {}}
              />
            </MessageProvider>
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
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
