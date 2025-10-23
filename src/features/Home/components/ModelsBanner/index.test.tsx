import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ComponentGroup,
  GeneralStatus,
  ModelStatus,
  MtoCommonSolutionKey
} from 'gql/generated/graphql';
import setup from 'tests/util';

import ModelsBanner from './index';

const mockModels = [
  {
    id: 'model-1',
    modelName: 'Model 1',
    status: ModelStatus.PLAN_DRAFT,
    generalStatus: GeneralStatus.PLANNED,
    abbreviation: 'M1',
    basics: {
      id: 'basics-1',
      modelCategory: null,
      __typename: 'PlanBasics' as const
    },
    timeline: {
      id: 'timeline-1',
      performancePeriodStarts: null,
      performancePeriodEnds: null,
      __typename: 'PlanTimeline' as const
    },
    __typename: 'ModelPlan' as const
  },
  {
    id: 'model-2',
    modelName: 'Model 2',
    status: ModelStatus.ACTIVE,
    generalStatus: GeneralStatus.ACTIVE,
    abbreviation: 'M2',
    basics: {
      id: 'basics-2',
      modelCategory: null,
      __typename: 'PlanBasics' as const
    },
    timeline: {
      id: 'timeline-2',
      performancePeriodStarts: '2024-01-01T00:00:00Z',
      performancePeriodEnds: '2025-12-31T00:00:00Z',
      __typename: 'PlanTimeline' as const
    },
    __typename: 'ModelPlan' as const
  },
  {
    id: 'model-3',
    modelName: 'Model 3',
    status: ModelStatus.ENDED,
    generalStatus: GeneralStatus.ENDED,
    abbreviation: 'M3',
    basics: {
      id: 'basics-3',
      modelCategory: null,
      __typename: 'PlanBasics' as const
    },
    timeline: {
      id: 'timeline-3',
      performancePeriodStarts: '2022-01-01T00:00:00Z',
      performancePeriodEnds: '2023-12-31T00:00:00Z',
      __typename: 'PlanTimeline' as const
    },
    __typename: 'ModelPlan' as const
  },
  {
    id: 'model-4',
    modelName: 'Model 4',
    status: ModelStatus.PLAN_COMPLETE,
    generalStatus: GeneralStatus.PLANNED,
    abbreviation: 'M4',
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
  }
];

describe('ModelsBanner', () => {
  it('renders with solution type and displays solution name', () => {
    const mockSetStatus = vi.fn();

    render(
      <ModelsBanner
        type="solution"
        filterKey={MtoCommonSolutionKey.INNOVATION}
        models={mockModels}
        selectedStatus="total"
        setSelectedStatus={mockSetStatus}
      />
    );

    // Should display solution name and acronym
    expect(screen.getByText(/4innovation/i)).toBeInTheDocument();
  });

  it('renders with group type and displays component group', () => {
    const mockSetStatus = vi.fn();

    render(
      <ModelsBanner
        type="group"
        filterKey={ComponentGroup.CCMI_PCMG}
        models={mockModels}
        selectedStatus="total"
        setSelectedStatus={mockSetStatus}
      />
    );

    // Should display translated component group name
    expect(screen.getByText('CMMI/PCMG')).toBeInTheDocument();
  });

  it('displays correct counts for each status', () => {
    const mockSetStatus = vi.fn();

    render(
      <ModelsBanner
        type="solution"
        filterKey={MtoCommonSolutionKey.INNOVATION}
        models={mockModels}
        selectedStatus="total"
        setSelectedStatus={mockSetStatus}
      />
    );

    // Total: all 4 models
    expect(screen.getByTestId('total-count')).toHaveTextContent('4');

    // Planned: 2 models (model-1 and model-4)
    expect(screen.getByTestId('planned-count')).toHaveTextContent('2');

    // Active: 1 model (model-2)
    expect(screen.getByTestId('active-count')).toHaveTextContent('1');

    // Ended: 1 model (model-3)
    expect(screen.getByTestId('ended-count')).toHaveTextContent('1');
  });

  it('highlights the selected status button', () => {
    const mockSetStatus = vi.fn();

    const { rerender } = render(
      <ModelsBanner
        type="solution"
        filterKey={MtoCommonSolutionKey.INNOVATION}
        models={mockModels}
        selectedStatus="total"
        setSelectedStatus={mockSetStatus}
      />
    );

    // Total button should be highlighted
    const totalButton = screen.getByTestId('total-count').closest('button');
    expect(totalButton).toHaveClass('bg-primary-darker');

    // Rerender with different selected status
    rerender(
      <ModelsBanner
        type="solution"
        filterKey={MtoCommonSolutionKey.INNOVATION}
        models={mockModels}
        selectedStatus={GeneralStatus.ACTIVE}
        setSelectedStatus={mockSetStatus}
      />
    );

    // Active button should now be highlighted
    const activeButton = screen.getByTestId('active-count').closest('button');
    expect(activeButton).toHaveClass('bg-primary-darker');

    // Total button should no longer be highlighted
    const totalButtonAfter = screen
      .getByTestId('total-count')
      .closest('button');
    expect(totalButtonAfter).not.toHaveClass('bg-primary-darker');
  });

  it('calls setSelectedStatus when status buttons are clicked', async () => {
    const mockSetStatus = vi.fn();

    const { user } = setup(
      <ModelsBanner
        type="solution"
        filterKey={MtoCommonSolutionKey.INNOVATION}
        models={mockModels}
        selectedStatus="total"
        setSelectedStatus={mockSetStatus}
      />
    );

    // Click on Planned button
    const plannedButton = screen.getByTestId('planned-count').closest('button');
    if (plannedButton) {
      await user.click(plannedButton);
    }
    expect(mockSetStatus).toHaveBeenCalledWith(GeneralStatus.PLANNED);

    // Click on Active button
    const activeButton = screen.getByTestId('active-count').closest('button');
    if (activeButton) {
      await user.click(activeButton);
    }
    expect(mockSetStatus).toHaveBeenCalledWith(GeneralStatus.ACTIVE);

    // Click on Ended button
    const endedButton = screen.getByTestId('ended-count').closest('button');
    if (endedButton) {
      await user.click(endedButton);
    }
    expect(mockSetStatus).toHaveBeenCalledWith(GeneralStatus.ENDED);

    // Click on Total button
    const totalButton = screen.getByTestId('total-count').closest('button');
    if (totalButton) {
      await user.click(totalButton);
    }
    expect(mockSetStatus).toHaveBeenCalledWith('total');

    expect(mockSetStatus).toHaveBeenCalledTimes(4);
  });

  it('displays zero counts when no models match a status', () => {
    const mockSetStatus = vi.fn();

    const plannedOnlyModels = [mockModels[0], mockModels[3]]; // Only planned models

    render(
      <ModelsBanner
        type="solution"
        filterKey={MtoCommonSolutionKey.INNOVATION}
        models={plannedOnlyModels}
        selectedStatus="total"
        setSelectedStatus={mockSetStatus}
      />
    );

    expect(screen.getByTestId('total-count')).toHaveTextContent('2');
    expect(screen.getByTestId('planned-count')).toHaveTextContent('2');
    expect(screen.getByTestId('active-count')).toHaveTextContent('0');
    expect(screen.getByTestId('ended-count')).toHaveTextContent('0');
  });

  it('handles empty models array', () => {
    const mockSetStatus = vi.fn();

    render(
      <ModelsBanner
        type="solution"
        filterKey={MtoCommonSolutionKey.INNOVATION}
        models={[]}
        selectedStatus="total"
        setSelectedStatus={mockSetStatus}
      />
    );

    expect(screen.getByTestId('total-count')).toHaveTextContent('0');
    expect(screen.getByTestId('planned-count')).toHaveTextContent('0');
    expect(screen.getByTestId('active-count')).toHaveTextContent('0');
    expect(screen.getByTestId('ended-count')).toHaveTextContent('0');
  });

  it('renders different component groups correctly', () => {
    const mockSetStatus = vi.fn();

    const groups = [
      ComponentGroup.CCMI_PCMG,
      ComponentGroup.CCMI_PPG,
      ComponentGroup.CCSQ,
      ComponentGroup.CM
    ];

    groups.forEach(group => {
      const { unmount } = render(
        <ModelsBanner
          type="group"
          filterKey={group}
          models={mockModels}
          selectedStatus="total"
          setSelectedStatus={mockSetStatus}
        />
      );

      // Should render the component group heading
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();

      unmount();
    });
  });

  it('renders different solutions correctly', () => {
    const mockSetStatus = vi.fn();

    const solutions = [
      MtoCommonSolutionKey.INNOVATION,
      MtoCommonSolutionKey.ACO_OS,
      MtoCommonSolutionKey.CCW,
      MtoCommonSolutionKey.CBOSC
    ];

    solutions.forEach(solution => {
      const { unmount } = render(
        <ModelsBanner
          type="solution"
          filterKey={solution}
          models={mockModels}
          selectedStatus="total"
          setSelectedStatus={mockSetStatus}
        />
      );

      // Should render the solution heading
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();

      unmount();
    });
  });

  it('matches snapshot with solution type', () => {
    const mockSetStatus = vi.fn();

    const { asFragment } = render(
      <ModelsBanner
        type="solution"
        filterKey={MtoCommonSolutionKey.INNOVATION}
        models={mockModels}
        selectedStatus="total"
        setSelectedStatus={mockSetStatus}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with group type', () => {
    const mockSetStatus = vi.fn();

    const { asFragment } = render(
      <ModelsBanner
        type="group"
        filterKey={ComponentGroup.CCMI_PCMG}
        models={mockModels}
        selectedStatus="total"
        setSelectedStatus={mockSetStatus}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with active status selected', () => {
    const mockSetStatus = vi.fn();

    const { asFragment } = render(
      <ModelsBanner
        type="solution"
        filterKey={MtoCommonSolutionKey.INNOVATION}
        models={mockModels}
        selectedStatus={GeneralStatus.ACTIVE}
        setSelectedStatus={mockSetStatus}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
