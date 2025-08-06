import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  commonMilestonesMock,
  commonSolutionsMock,
  milestoneMock,
  modelID
} from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import MTOTableActions from '.';

describe('MTO Table Actions Component', () => {
  it('renders correctly and matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations',
          element: (
            <MessageProvider>
              <MTOTableActions />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations`
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider
        mocks={[
          ...commonSolutionsMock,
          ...milestoneMock(modelID),
          ...commonMilestonesMock,
          ...commonMilestonesMock
        ]}
        addTypename={false}
      >
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(async () => {
      expect(screen.getByText(/1 common milestones/i)).toBeInTheDocument();
      expect(
        screen.getByText(/2 common solutions and IT systems/i)
      ).toBeInTheDocument();
    });

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
