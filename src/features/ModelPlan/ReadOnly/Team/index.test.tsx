import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { collaboratorsMocks as mocks, modelID } from 'tests/mock/readonly';

import ReadOnlyTeamInfo from './index';

describe('Read Only Model Plan Summary -- Model Basics', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/team',
          element: <ReadOnlyTeamInfo modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/team`]
      }
    );

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('read-only-model-plan--team-info')
      ).toBeInTheDocument();
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/team',
          element: <ReadOnlyTeamInfo modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/team`]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('read-only-model-plan--team-info')
      ).toBeInTheDocument();
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
