import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  GeneralStatus,
  ModelCategory,
  ModelStatus
} from 'gql/generated/graphql';

import ModelCard from './index';

const mockModelPlan = {
  id: 'test-model-id-123',
  modelName: 'Test Model Plan',
  abbreviation: 'TMP',
  status: ModelStatus.ACTIVE,
  generalStatus: GeneralStatus.ACTIVE,
  basics: {
    id: 'basics-id-123',
    modelCategory: ModelCategory.ACCOUNTABLE_CARE,
    __typename: 'PlanBasics' as const
  },
  timeline: {
    id: 'timeline-id-123',
    performancePeriodStarts: '2024-01-15T00:00:00Z',
    performancePeriodEnds: '2025-12-31T00:00:00Z',
    __typename: 'PlanTimeline' as const
  },
  __typename: 'ModelPlan' as const
};

const mockModelPlanNoOptionalData = {
  id: 'test-model-id-456',
  modelName: 'Minimal Model Plan',
  abbreviation: null,
  status: ModelStatus.PLAN_DRAFT,
  generalStatus: GeneralStatus.PLANNED,
  basics: {
    id: 'basics-id-456',
    modelCategory: null,
    __typename: 'PlanBasics' as const
  },
  timeline: {
    id: 'timeline-id-456',
    performancePeriodStarts: null,
    performancePeriodEnds: null,
    __typename: 'PlanTimeline' as const
  },
  __typename: 'ModelPlan' as const
};

describe('ModelSolutionCard', () => {
  it('renders model card with all data', () => {
    render(
      <MemoryRouter>
        <ModelCard modelPlan={mockModelPlan} />
      </MemoryRouter>
    );

    // Check model name and abbreviation
    expect(screen.getByText('Test Model Plan (TMP)')).toBeInTheDocument();

    // Check link to model
    const link = screen.getByRole('link', { name: /Test Model Plan/ });
    expect(link).toHaveAttribute('href', '/models/test-model-id-123/read-view');

    // Check status is displayed
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Check category is displayed
    expect(screen.getByText('Accountable Care')).toBeInTheDocument();

    // Check dates are displayed
    expect(screen.getByText('Start date')).toBeInTheDocument();
    expect(screen.getByText('01/15/2024')).toBeInTheDocument();

    expect(screen.getByText('End date')).toBeInTheDocument();
    expect(screen.getByText('12/31/2025')).toBeInTheDocument();
  });

  it('renders model card without abbreviation', () => {
    const modelWithoutAbbr = {
      ...mockModelPlan,
      abbreviation: null
    };

    render(
      <MemoryRouter>
        <ModelCard modelPlan={modelWithoutAbbr} />
      </MemoryRouter>
    );

    // Should show model name without parentheses
    expect(screen.getByText('Test Model Plan')).toBeInTheDocument();
    expect(screen.queryByText(/\(/)).not.toBeInTheDocument();
  });

  it('renders TBD for missing optional fields', () => {
    render(
      <MemoryRouter>
        <ModelCard modelPlan={mockModelPlanNoOptionalData} />
      </MemoryRouter>
    );

    // Check model name without abbreviation
    expect(screen.getByText('Minimal Model Plan')).toBeInTheDocument();

    // Should show TBD for category, start date, and end date
    const tbdElements = screen.getAllByText('To be determined');
    expect(tbdElements.length).toBe(3); // Category + Start date + End date
  });

  it('displays different model statuses correctly', () => {
    const statuses = [
      ModelStatus.PLAN_DRAFT,
      ModelStatus.PLAN_COMPLETE,
      ModelStatus.ACTIVE,
      ModelStatus.ENDED,
      ModelStatus.PAUSED
    ];

    statuses.forEach(status => {
      const model = {
        ...mockModelPlan,
        status
      };

      const { unmount } = render(
        <MemoryRouter>
          <ModelCard modelPlan={model} />
        </MemoryRouter>
      );

      // Status tag should be rendered
      expect(screen.getByText('Status')).toBeInTheDocument();

      unmount();
    });
  });

  it('renders model card with different dates', () => {
    const modelWithDifferentDates = {
      ...mockModelPlan,
      timeline: {
        id: 'timeline-id-789',
        performancePeriodStarts: '2023-06-01T12:30:45Z',
        performancePeriodEnds: '2024-11-15T08:15:22Z',
        __typename: 'PlanTimeline' as const
      }
    };

    render(
      <MemoryRouter>
        <ModelCard modelPlan={modelWithDifferentDates} />
      </MemoryRouter>
    );

    // Dates should be formatted as MM/dd/yyyy
    expect(screen.getByText('06/01/2023')).toBeInTheDocument();
    expect(screen.getByText('11/15/2024')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ModelCard modelPlan={mockModelPlan} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with minimal data', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ModelCard modelPlan={mockModelPlanNoOptionalData} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
