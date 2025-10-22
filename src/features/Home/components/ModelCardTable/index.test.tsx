import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import {
  ComponentGroup,
  GeneralStatus,
  ModelCategory,
  ModelStatus,
  MtoCommonSolutionKey
} from 'gql/generated/graphql';
import setup from 'tests/util';

import ModelsCardTable from './index';

const mockModels = [
  {
    id: 'model-1',
    modelName: 'Patient Care Model Alpha',
    abbreviation: 'PCMA',
    status: ModelStatus.PLAN_DRAFT,
    generalStatus: GeneralStatus.PLANNED,
    basics: {
      id: 'basics-1',
      modelCategory: ModelCategory.ACCOUNTABLE_CARE,
      __typename: 'PlanBasics' as const
    },
    timeline: {
      id: 'timeline-1',
      performancePeriodStarts: '2024-01-15T00:00:00Z',
      performancePeriodEnds: '2025-06-30T00:00:00Z',
      __typename: 'PlanTimeline' as const
    },
    __typename: 'ModelPlan' as const
  },
  {
    id: 'model-2',
    modelName: 'Quality Improvement Model Beta',
    abbreviation: 'QIMB',
    status: ModelStatus.ACTIVE,
    generalStatus: GeneralStatus.ACTIVE,
    basics: {
      id: 'basics-2',
      modelCategory: ModelCategory.DISEASE_SPECIFIC_AND_EPISODIC,
      __typename: 'PlanBasics' as const
    },
    timeline: {
      id: 'timeline-2',
      performancePeriodStarts: '2023-07-01T00:00:00Z',
      performancePeriodEnds: '2024-12-31T00:00:00Z',
      __typename: 'PlanTimeline' as const
    },
    __typename: 'ModelPlan' as const
  },
  {
    id: 'model-3',
    modelName: 'Innovation Project Gamma',
    abbreviation: 'IPG',
    status: ModelStatus.ENDED,
    generalStatus: GeneralStatus.ENDED,
    basics: {
      id: 'basics-3',
      modelCategory: ModelCategory.HEALTH_PLAN,
      __typename: 'PlanBasics' as const
    },
    timeline: {
      id: 'timeline-3',
      performancePeriodStarts: '2021-01-01T00:00:00Z',
      performancePeriodEnds: '2022-12-31T00:00:00Z',
      __typename: 'PlanTimeline' as const
    },
    __typename: 'ModelPlan' as const
  },
  {
    id: 'model-4',
    modelName: 'Test Model Delta',
    abbreviation: 'TMD',
    status: ModelStatus.PLAN_COMPLETE,
    generalStatus: GeneralStatus.PLANNED,
    basics: {
      id: 'basics-4',
      modelCategory: null,
      __typename: 'PlanBasics' as const
    },
    timeline: {
      id: 'timeline-4',
      performancePeriodStarts: null,
      performancePeriodEnds: null,
      __typename: 'PlanTimeline' as const
    },
    __typename: 'ModelPlan' as const
  },
  {
    id: 'model-5',
    modelName: 'Another Model Epsilon',
    abbreviation: 'AME',
    status: ModelStatus.PLAN_DRAFT,
    generalStatus: GeneralStatus.PLANNED,
    basics: {
      id: 'basics-5',
      modelCategory: ModelCategory.TO_BE_DETERMINED,
      __typename: 'PlanBasics' as const
    },
    timeline: {
      id: 'timeline-5',
      performancePeriodStarts: '2025-03-01T00:00:00Z',
      performancePeriodEnds: '2026-02-28T00:00:00Z',
      __typename: 'PlanTimeline' as const
    },
    __typename: 'ModelPlan' as const
  }
];

describe('ModelsCardTable', () => {
  it('renders with solution type and displays all models', () => {
    render(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    // Should display banner
    expect(screen.getByTestId('total-count')).toHaveTextContent('5');

    // Should display first 3 models (pagination default)
    expect(screen.getByText(/Patient Care Model Alpha/)).toBeInTheDocument();
    expect(
      screen.getByText(/Quality Improvement Model Beta/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Innovation Project Gamma/)).toBeInTheDocument();
  });

  it('renders with group type and displays all models', () => {
    render(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={ComponentGroup.CCMI_PCMG}
          type="group"
        />
      </MemoryRouter>
    );

    // Should display banner
    expect(screen.getByTestId('total-count')).toHaveTextContent('5');

    // Should display models
    expect(screen.getByText(/Patient Care Model Alpha/)).toBeInTheDocument();
  });

  it('filters models by status when status button is clicked', async () => {
    const { user } = setup(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    // Initially shows all models
    expect(screen.getByTestId('total-count')).toHaveTextContent('5');

    // Click on Planned status
    const plannedButton = screen.getByTestId('planned-count').closest('button');
    if (plannedButton) {
      await user.click(plannedButton);
    }

    // Should now only show planned models (3 total: model-1, model-4, model-5)
    await waitFor(() => {
      expect(screen.getByText(/Patient Care Model Alpha/)).toBeInTheDocument();
      expect(screen.getByText(/Another Model Epsilon/)).toBeInTheDocument();
    });

    // Active model should not be visible
    expect(
      screen.queryByText(/Quality Improvement Model Beta/)
    ).not.toBeInTheDocument();
  });

  it('shows search filter when there are more than 4 models', () => {
    render(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    // Search input should be visible with 5 models
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('hides search filter when there are 4 or fewer models', () => {
    const fewModels = mockModels.slice(0, 3);

    render(
      <MemoryRouter>
        <ModelsCardTable
          models={fewModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    // Search input should not be visible with only 3 models
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('filters models by search query', async () => {
    const { user } = setup(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    const searchInput = screen.getByRole('searchbox');

    // Search for "alpha"
    await user.type(searchInput, 'alpha');

    await waitFor(() => {
      // Should only show Patient Care Model Alpha
      expect(screen.getByText(/Patient Care Model Alpha/)).toBeInTheDocument();
      expect(
        screen.queryByText(/Quality Improvement Model Beta/)
      ).not.toBeInTheDocument();
    });
  });

  it('displays alert when no models exist', () => {
    render(
      <MemoryRouter>
        <ModelsCardTable
          models={[]}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    // Should show no models alert
    expect(
      screen.getByText(/There is no record of any models/)
    ).toBeInTheDocument();
  });

  it('displays alert when status filter results in no models', async () => {
    // Only planned models
    const plannedModels = mockModels.filter(
      m => m.generalStatus === GeneralStatus.PLANNED
    );

    const { user } = setup(
      <MemoryRouter>
        <ModelsCardTable
          models={plannedModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    // Click on Active status (no active models exist)
    const activeButton = screen.getByTestId('active-count').closest('button');
    if (activeButton) {
      await user.click(activeButton);
    }

    await waitFor(() => {
      expect(
        screen.getByText(/There is no record of any active models/)
      ).toBeInTheDocument();
    });
  });

  it('displays pagination with 3 items per page', () => {
    render(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    // Should show pagination controls
    expect(screen.getByText(/Showing 1-3 of 5/)).toBeInTheDocument();
  });

  it('searches by model name', async () => {
    const { user } = setup(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'Gamma');

    await waitFor(() => {
      expect(screen.getByText(/Innovation Project Gamma/)).toBeInTheDocument();
      expect(
        screen.queryByText(/Patient Care Model Alpha/)
      ).not.toBeInTheDocument();
    });
  });

  it('searches by abbreviation', async () => {
    const { user } = setup(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'QIMB');

    await waitFor(() => {
      expect(
        screen.getByText(/Quality Improvement Model Beta/)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Patient Care Model Alpha/)
      ).not.toBeInTheDocument();
    });
  });

  it('searches by date', async () => {
    const { user } = setup(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, '01/15/2024');

    await waitFor(() => {
      expect(screen.getByText(/Patient Care Model Alpha/)).toBeInTheDocument();
      expect(
        screen.queryByText(/Quality Improvement Model Beta/)
      ).not.toBeInTheDocument();
    });
  });

  it('shows appropriate message for solution type with no models', () => {
    render(
      <MemoryRouter>
        <ModelsCardTable
          models={[]}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/There is no record of any models using this solution/)
    ).toBeInTheDocument();
  });

  it('shows appropriate message for group type with no models', () => {
    render(
      <MemoryRouter>
        <ModelsCardTable
          models={[]}
          filterKey={ComponentGroup.CCMI_PCMG}
          type="group"
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/There is no record of any models in this group/)
    ).toBeInTheDocument();
  });

  it('resets to all models when switching from filtered status to total', async () => {
    const { user } = setup(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    // Click on Active status (1 model)
    const activeButton = screen.getByTestId('active-count').closest('button');
    if (activeButton) {
      await user.click(activeButton);
    }

    await waitFor(() => {
      expect(
        screen.getByText(/Quality Improvement Model Beta/)
      ).toBeInTheDocument();
    });

    // Click back to Total
    const totalButton = screen.getByTestId('total-count').closest('button');
    if (totalButton) {
      await user.click(totalButton);
    }

    await waitFor(() => {
      // Should show multiple models again
      expect(screen.getByText(/Patient Care Model Alpha/)).toBeInTheDocument();
      expect(
        screen.getByText(/Quality Improvement Model Beta/)
      ).toBeInTheDocument();
    });
  });

  it('clears search when status changes', async () => {
    const { user } = setup(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    // Type in search
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'Alpha');

    await waitFor(() => {
      expect(screen.getByText(/Patient Care Model Alpha/)).toBeInTheDocument();
    });

    // Click on a status filter
    const activeButton = screen.getByTestId('active-count').closest('button');
    if (activeButton) {
      await user.click(activeButton);
    }

    await waitFor(() => {
      // Search should still apply to filtered results
      expect(
        screen.queryByText(/Patient Care Model Alpha/)
      ).not.toBeInTheDocument();
    });
  });

  it('updates filtered models when models prop changes', () => {
    const { rerender } = render(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels.slice(0, 2)}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('total-count')).toHaveTextContent('2');

    // Update with more models
    rerender(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('total-count')).toHaveTextContent('5');
  });

  it('matches snapshot with solution type', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with group type', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ModelsCardTable
          models={mockModels}
          filterKey={ComponentGroup.CCMI_PCMG}
          type="group"
        />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with no models', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ModelsCardTable
          models={[]}
          filterKey={MtoCommonSolutionKey.INNOVATION}
          type="solution"
        />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
