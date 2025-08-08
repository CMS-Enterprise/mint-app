import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import {
  commonSolutionsMock,
  modelID,
  possibleSolutionsMock
} from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import SolutionLibrary from '.';

describe('SolutionLibrary Component', () => {
  it('renders correctly and matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/solution-library',
          element: (
            <MessageProvider>
              <SolutionLibrary />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/solution-library`
        ]
      }
    );

    const { asFragment, getByText } = render(
      <MockedProvider
        mocks={[...commonSolutionsMock, ...possibleSolutionsMock]}
        addTypename={false}
      >
        <RouterProvider router={router} />
      </MockedProvider>
    );

    // Match the snapshot
    await waitFor(() => {
      expect(getByText('Don’t see the solution you need?')).toBeInTheDocument();
      expect(
        getByText('Accountable Care Organization - Operational System')
      ).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
