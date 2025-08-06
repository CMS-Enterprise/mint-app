import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import i18next from 'i18next';
import { milestoneMock, modelID } from 'tests/mock/mto';

import MilestonePanel from './index';

describe('MilestonePanel Component', () => {
  it('renders correctly with milestone data', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <MilestonePanel closeModal={vi.fn()} />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/read-view/milestones?view-milestone=123`
        ]
      }
    );

    render(
      <MockedProvider addTypename={false} mocks={milestoneMock('123')}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    // Wait for the milestone data to load
    await waitFor(() => {
      expect(screen.getByText('Milestone 1')).toBeInTheDocument();
    });

    // Check for milestone details
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('SubCategory 1')).toBeInTheDocument();
    expect(screen.getByText('Solution 1')).toBeInTheDocument();

    // TODO: Add snapshot test and figure out why Truss tooltip is causing flakiness only here
  });

  it('renders no solutions message when no solutions are available', async () => {
    const noSolutionsMock = milestoneMock('123');

    const result = noSolutionsMock[0].result as any;
    if (result.data) {
      result.data.mtoMilestone.solutions = [];
    }

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <MilestonePanel closeModal={vi.fn()} />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/read-view/milestones?view-milestone=123`
        ]
      }
    );

    render(
      <MockedProvider addTypename={false} mocks={noSolutionsMock}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    // Wait for the milestone data to load
    await waitFor(() => {
      expect(
        screen.getByText(
          i18next.t(
            'modelToOperationsMisc:modal.editMilestone.noSolutionsTable'
          )
        )
      ).toBeInTheDocument();
    });
  });
});
