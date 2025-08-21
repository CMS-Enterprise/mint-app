import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Contact from '.';

const contact: SolutionContactType = {
  __typename: 'MTOCommonSolutionContact',
  id: '123',
  mailboxTitle: '',
  mailboxAddress: '',
  name: 'Aliza Kim',
  email: 'aliza.kim@cms.hhs.gov',
  isTeam: false,
  role: 'Project Lead',
  isPrimary: true,
  receiveEmails: false
};

export default {
  title: 'Help and Knowledge Solution Contact',
  component: Contact,
  decorators: [
    Story => (
      <RouterProvider
        router={createMemoryRouter(
          [
            {
              path: '/help-and-knowledge/operational-solutions',
              element: <Contact contact={contact} />
            }
          ],
          {
            initialEntries: [
              '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=about'
            ]
          }
        )}
      />
    )
  ]
} as Meta<typeof Contact>;

export const Default = () => (
  <RouterProvider
    router={createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: <Contact contact={contact} />
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=about'
        ]
      }
    )}
  />
);
