import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  modelID,
  possibleSolutionsMock,
  solutionAndMilestoneMock
} from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import ITSystemsTable from './index';

describe('ITSystemsTable Component', () => {
  it('renders correctly and matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <ITSystemsTable />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=solutions`
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider
        mocks={[...possibleSolutionsMock, ...solutionAndMilestoneMock]}
        addTypename={false}
      >
        <RouterProvider router={router} />
      </MockedProvider>
    );

    // Wait for the component to finish loading
    await screen.findByText('Solution 1');

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
