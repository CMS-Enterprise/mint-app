import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import NewPlan from './index';

describe('New Model Plan page', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/new-plan',
          element: <NewPlan />
        }
      ],
      {
        initialEntries: ['/models/new-plan']
      }
    );

    render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('new-plan')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/new-plan',
          element: <NewPlan />
        }
      ],
      {
        initialEntries: ['/models/new-plan']
      }
    );

    const { asFragment } = render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
