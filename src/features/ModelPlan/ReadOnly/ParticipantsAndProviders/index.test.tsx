import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  modelID,
  participantsAndProvidersMocks as mocks
} from 'tests/mock/readonly';

import ReadOnlyParticipantsAndProviders from './index';

describe('Read Only Model Plan Summary -- Participants And Providers', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/participants-and-providers',
          element: <ReadOnlyParticipantsAndProviders modelID={modelID} />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/read-view/participants-and-providers`
        ]
      }
    );

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(screen.getByText('Medicaid providers')).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/participants-and-providers',
          element: <ReadOnlyParticipantsAndProviders modelID={modelID} />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/read-view/participants-and-providers`
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Medicaid providers')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
