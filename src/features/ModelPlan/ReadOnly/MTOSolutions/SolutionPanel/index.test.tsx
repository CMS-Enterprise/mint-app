import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import i18next from 'i18next';
import Sinon from 'sinon';
import { modelID, solutionMock } from 'tests/mock/mto';

import SolutionPanel from './index';

describe('SolutionPanel Component', () => {
  // Stubing Math.random that occurs in Truss Tooltip component for deterministic output
  Sinon.stub(Math, 'random').returns(0.5);

  it('renders correctly with solution data', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-view/solutions?view-solution=1`
        ]}
      >
        <MockedProvider addTypename={false} mocks={[solutionMock('1')]}>
          <SolutionPanel closeModal={vi.fn()} />
        </MockedProvider>
      </MemoryRouter>
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

    render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-view/solutions?view-solution=1`
        ]}
      >
        <MockedProvider addTypename={false} mocks={[noSolutionsMock]}>
          <SolutionPanel closeModal={vi.fn()} />
        </MockedProvider>
      </MemoryRouter>
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
