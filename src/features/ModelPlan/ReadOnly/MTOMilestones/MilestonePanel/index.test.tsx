import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import i18next from 'i18next';
import { milestoneMock, modelID } from 'tests/mock/mto';

import MilestonePanel from './index';

describe('MilestonePanel Component', () => {
  it('renders correctly with milestone data', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-view/milestones?view-milestone=123`
        ]}
      >
        <MockedProvider addTypename={false} mocks={milestoneMock('123')}>
          <MilestonePanel closeModal={vi.fn()} />
        </MockedProvider>
      </MemoryRouter>
    );

    // Wait for the milestone data to load
    await waitFor(() => {
      expect(screen.getByText('Milestone 1')).toBeInTheDocument();
    });

    // Check for milestone details
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('SubCategory 1')).toBeInTheDocument();
    expect(screen.getByText('Solution 1')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders no solutions message when no solutions are available', async () => {
    const noSolutionsMock = milestoneMock('123');

    const result = noSolutionsMock[0].result as any;
    if (result.data) {
      result.data.mtoMilestone.solutions = [];
    }

    render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-view/milestones?view-milestone=123`
        ]}
      >
        <MockedProvider addTypename={false} mocks={noSolutionsMock}>
          <MilestonePanel closeModal={vi.fn()} />
        </MockedProvider>
      </MemoryRouter>
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
