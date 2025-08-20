import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import MailboxAndTeamMembers from '.';

const contacts: SolutionContactType[] = [
  {
    __typename: 'MTOCommonSolutionContact',
    id: '123',
    name: 'Zinnia Purple',
    email: 'zinnia.purple@cms.hhs.gov',
    mailboxTitle: '',
    mailboxAddress: '',
    isTeam: false,
    role: 'Tech Lead',
    isPrimary: false,
    receiveEmails: false
  },
  {
    __typename: 'MTOCommonSolutionContact',
    id: '123',
    name: 'Aliza Kim',
    email: 'aliza.kim@cms.hhs.gov',
    mailboxTitle: '',
    mailboxAddress: '',
    isTeam: false,
    role: 'Project Lead',
    isPrimary: true,
    receiveEmails: true
  }
];

const mocks = [...possibleSolutionsMock];

describe('MailboxAndTeamMembers Component', () => {
  it('should renders contact by primary then name alphabetally', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <MailboxAndTeamMembers pointsOfContact={contacts} />
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

    const { getAllByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    const allContactsNames = getAllByTestId('point-of-contact-name');
    expect(allContactsNames[0].textContent).toBe('Aliza Kim');
    expect(allContactsNames[1].textContent).toBe('Zinnia Purple');
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions/solutions',
          element: (
            <MessageProvider>
              <MailboxAndTeamMembers pointsOfContact={contacts} />
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
