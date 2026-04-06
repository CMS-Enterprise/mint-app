import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import CommonMilestoneAdminActions from './index';

describe('CommonMilestoneAdminActions Component', () => {
  it('renders correctly', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/milestone-library',
          element: <CommonMilestoneAdminActions />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/milestone-library']
      }
    );

    const { getByText, getByRole } = render(<RouterProvider router={router} />);

    expect(getByText('Admin actions')).toBeInTheDocument();

    const commonMilestoneLink = getByRole('link', {
      name: /Add a milestone/
    });
    expect(commonMilestoneLink).toHaveAttribute('href', '/');
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/milestone-library',
          element: <CommonMilestoneAdminActions />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/milestone-library']
      }
    );
    const { asFragment } = render(<RouterProvider router={router} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
