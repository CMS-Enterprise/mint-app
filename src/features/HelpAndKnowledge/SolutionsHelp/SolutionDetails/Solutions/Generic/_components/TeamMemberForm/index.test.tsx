import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import TeamMemberForm from './index';

const mocks = [...possibleSolutionsMock];

const team: SolutionContactType = {
  __typename: 'MTOCommonSolutionContact',
  id: '123',
  name: 'Blue Bonnet',
  email: 'memberemail@email.com',
  mailboxTitle: '',
  mailboxAddress: '',
  isTeam: false,
  isPrimary: false,
  role: 'Project Lead',
  receiveEmails: false
};

describe('Team member point of contact form', () => {
  it('should render team member info accordingly', async () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <TeamMemberForm
                mode="editTeamMember"
                closeModal={() => {}}
                teamMember={team}
                setDisableButton={() => {}}
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByText('This field searches CMS’ EUA database.')
      ).toBeInTheDocument();
      expect(getByTestId('team-member-role')).toHaveValue('Project Lead');
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
              <TeamMemberForm
                mode="editTeamMember"
                closeModal={() => {}}
                teamMember={{ ...team, isPrimary: true, receiveEmails: true }}
                setDisableButton={() => {}}
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
              <TeamMemberForm
                mode="addTeamMember"
                closeModal={() => {}}
                teamMember={team}
                setDisableButton={() => {}}
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
