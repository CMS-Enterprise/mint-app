import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import EditTeamMailboxForm from './index';

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
  receiveEmails: false
};

describe('Edit a team mailbox point of contact form', () => {
  it('should render team mailbox info accordingly', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <EditTeamMailboxForm closeModal={() => {}} teamMailbox={team} />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
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
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <EditTeamMailboxForm
                closeModal={() => {}}
                teamMailbox={{ ...team, isPrimary: true, receiveEmails: true }}
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('isPrimary')).toBeChecked();
      expect(getByTestId('receiveEmails')).toBeChecked();
    });
  });

  it('should matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <EditTeamMailboxForm closeModal={() => {}} teamMailbox={team} />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
