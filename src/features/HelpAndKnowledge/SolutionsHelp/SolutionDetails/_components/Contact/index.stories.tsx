import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Contact from '.';

const contact: SolutionContactType = {
  __typename: 'MTOCommonSolutionContact',
  id: '123',
  isTeam: false,
  role: 'Project Lead',
  isPrimary: true,
  userAccount: {
    __typename: 'UserAccount',
    givenName: 'Aliza Kim',
    email: 'aliza.kim@cms.hhs.gov'
  }
};

export default {
  title: 'Help and Knowledge Solution Contact',
  component: Contact,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=about'
        ]}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <Contact contact={contact} />
        </Route>
      </MemoryRouter>
    )
  ]
} as Meta<typeof Contact>;

export const Default = () => (
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
