import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';

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

    const ctatTicketLink = getByRole('link', {
      name: /View contract assistance tickets/
    });
    expect(ctatTicketLink).toHaveAttribute(
      'href',
      '/help-and-knowledge/contract-assistance'
    );
  });

  it('toggles admin action content visibility', () => {
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

    const { getByTestId, getByText, queryByText } = render(
      <RouterProvider router={router} />
    );

    expect(getByText('Manage common milestones')).toBeInTheDocument();

    fireEvent.click(getByTestId('admin-actions-toggle'));

    expect(queryByText('Manage common milestones')).not.toBeInTheDocument();
    expect(getByText('Show admin actions')).toBeInTheDocument();

    fireEvent.click(getByTestId('admin-actions-toggle'));

    expect(getByText('Manage common milestones')).toBeInTheDocument();
    expect(getByText('Hide admin actions')).toBeInTheDocument();
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
