import React from 'react';
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes
} from 'react-router-dom';
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
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <TeamMemberForm
                mode="editTeamMember"
                closeModal={() => {}}
                teamMember={team}
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
    const { getByTestId, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
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
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <TeamMemberForm
                mode="editTeamMember"
                closeModal={() => {}}
                teamMember={{ ...team, isPrimary: true, receiveEmails: true }}
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
              <TeamMemberForm
                mode="addTeamMember"
                closeModal={() => {}}
                teamMember={team}
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
