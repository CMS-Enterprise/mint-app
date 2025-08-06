import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import i18next from 'i18next';
import { modelID, solutionMock } from 'tests/mock/mto';

import SolutionPanel from './index';

describe('SolutionPanel Component', () => {
  it('renders correctly with solution data', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/solutions',
          element: <SolutionPanel closeModal={vi.fn()} />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/read-view/solutions?view-solution=1`
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider addTypename={false} mocks={[solutionMock('1')]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    // Wait for the solution data to load
    await waitFor(() => {
      expect(screen.getByText('Solution 1')).toBeInTheDocument();
    });

    // Check for solution details
    expect(screen.getByText('08/01/2121')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders no milestones message when no milestones are available', async () => {
    const noSolutionsMock = solutionMock('1');

    const result = noSolutionsMock.result as any;
    if (result.data) {
      result.data.mtoSolution.milestones = [];
    }

    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/solutions',
          element: <SolutionPanel closeModal={vi.fn()} />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/read-view/solutions?view-solution=1`
        ]
      }
    );

    render(
      <MockedProvider addTypename={false} mocks={[noSolutionsMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    // Wait for the solution data to load
    await waitFor(() => {
      expect(
        screen.getByText(
          i18next.t(
            'modelToOperationsMisc:modal.editSolution.noMilestonesTable'
          )
        )
      ).toBeInTheDocument();
    });
  });
});
