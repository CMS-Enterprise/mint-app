import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Contact from './index';

const contact: SolutionContactType = {
  __typename: 'MTOCommonSolutionContact',
  id: '123',
  name: 'Aliza Kim',
  email: 'aliza.kim@cms.hhs.gov',
  mailboxTitle: '',
  mailboxAddress: '',
  isTeam: false,
  role: 'Project Lead',
  isPrimary: true,
  receiveEmails: false
};

describe('Operation Solution Contact', () => {
  it('renders contact name', () => {
    const router = createMemoryRouter(
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
    );

    const { getByText } = render(<RouterProvider router={router} />);
    expect(getByText('Aliza Kim')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
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
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
