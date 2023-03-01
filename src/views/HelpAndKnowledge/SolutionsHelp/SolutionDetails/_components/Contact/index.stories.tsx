import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ComponentMeta } from '@storybook/react';

import { SolutionContactType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Contact from '.';

const contact: SolutionContactType = {
  name: 'Aliza Kim',
  email: 'aliza.kim@cms.hhs.gov',
  role: 'Project Lead'
};

export default {
  title: 'Help and Knowledge Solution Contact',
  component: Contact,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solution/accountable-care-organization/about'
        ]}
      >
        <Route path="/help-and-knowledge/operational-solutions/solution/:solution/:page?">
          <Contact
            contact={contact}
            solutionRoute="chronic-conditions-warehouse"
          />
        </Route>
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof Contact>;

export const Default = () => (
  <MemoryRouter
    initialEntries={[
      '/help-and-knowledge/operational-solutions/solution/accountable-care-organization/about'
    ]}
  >
    <Route path="/help-and-knowledge/operational-solutions/solution/:solution/:page?">
      <Contact contact={contact} solutionRoute="chronic-conditions-warehouse" />
    </Route>
  </MemoryRouter>
);
