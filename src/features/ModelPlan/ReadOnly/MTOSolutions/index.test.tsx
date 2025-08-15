import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  modelID,
  possibleSolutionsMock,
  solutionAndMilestoneMock
} from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import ReadOnlyMTOSolutions from './index';

describe('Read view MTO milestones', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/milestones',
          element: (
            <MessageProvider>
              <ReadOnlyMTOSolutions modelID={modelID} />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/milestones`]
      }
    );

    const { asFragment } = render(
      <MockedProvider
        mocks={[...solutionAndMilestoneMock, ...possibleSolutionsMock]}
        addTypename={false}
      >
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Ready for review')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Solution 1')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
