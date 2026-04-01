import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import AdminActions from './index';

describe('AdminActions Component', () => {
  it('renders correctly', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <AdminActions />
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText, getByRole } = render(<RouterProvider router={router} />);

    expect(getByText('Admin actions')).toBeInTheDocument();

    const commonMilestoneLink = getByRole('link', {
      name: /View common milestones/
    });
    expect(commonMilestoneLink).toHaveAttribute(
      'href',
      '/help-and-knowledge/milestone-library'
    );

    const keyContactLink = getByRole('link', {
      name: /View SME contact directory/
    });
    expect(keyContactLink).toHaveAttribute(
      'href',
      '/help-and-knowledge#contact-directory'
    );
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <AdminActions />
        }
      ],
      {
        initialEntries: ['/']
      }
    );
    const { asFragment } = render(<RouterProvider router={router} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
