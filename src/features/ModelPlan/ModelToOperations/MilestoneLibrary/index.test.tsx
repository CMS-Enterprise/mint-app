import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { commonMilestonesMock, suggestedMilestonesMock } from 'tests/mock/mto';

import MilestoneLibrary from '.';

describe('MilestoneCardGroup Component', () => {
  it('renders correctly and matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/milestone-library',
          element: <MilestoneLibrary />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-to-operations/milestone-library'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider
        mocks={[...suggestedMilestonesMock, ...commonMilestonesMock]}
        addTypename={false}
      >
        <RouterProvider router={router} />
      </MockedProvider>
    );

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
