import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
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
    const { getAllByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <MailboxAndTeamMembers pointsOfContact={contacts} />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    const allContactsNames = getAllByTestId('point-of-contact-name');
    expect(allContactsNames[0].textContent).toBe('Aliza Kim');
    expect(allContactsNames[1].textContent).toBe('Zinnia Purple');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <MailboxAndTeamMembers pointsOfContact={contacts} />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
