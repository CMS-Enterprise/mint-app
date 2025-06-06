import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Contact from './index';

const contact: SolutionContactType = {
  __typename: 'MTOCommonSolutionContact',
  id: '123',
  mailboxTitle: '',
  mailboxAddress: '',
  userAccount: {
    __typename: 'UserAccount',
    id: '456',
    givenName: 'Aliza',
    familyName: 'Kim',
    email: 'aliza.kim@cms.hhs.gov'
  },
  isTeam: false,
  role: 'Project Lead',
  isPrimary: true,
  receiveEmails: false
};

describe('Operation Solution Contact', () => {
  it('renders contact name', () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=about'
        ]}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <Contact contact={contact} />
        </Route>
      </MemoryRouter>
    );
    expect(getByText('Aliza Kim')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=about'
        ]}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <Contact contact={contact} />
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
