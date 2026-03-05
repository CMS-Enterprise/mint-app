import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MtoFacilitator } from 'gql/generated/graphql';
import i18next from 'i18next';

import { MilestoneSelectedFilters } from '../MilestoneFilterModal';

import MilestoneFilterTags from '.';

const appliedFilters: MilestoneSelectedFilters = {
  categoryName: ['Category 1'],
  facilitatedByRole: [MtoFacilitator.MODEL_TEAM]
};

describe('MilestoneFilterTags', () => {
  const defaultAppliedFilters: MilestoneSelectedFilters = {
    categoryName: [],
    facilitatedByRole: []
  };

  it('does not render when no filters are applied', () => {
    const { container } = render(
      <MilestoneFilterTags
        appliedFilters={defaultAppliedFilters}
        setAppliedFilters={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('displays applied filters and clear all button', () => {
    render(
      <MilestoneFilterTags
        appliedFilters={appliedFilters}
        setAppliedFilters={vi.fn()}
      />
    );

    // Renders the filters count
    expect(screen.getByText('Filters (2)')).toBeInTheDocument();

    expect(
      screen.getByRole('listitem', { name: 'Category: Category 1' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('listitem', { name: 'Role: Model team' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Clear all'
      })
    ).toBeInTheDocument();
  });

  it('removes individual filters and clears all filters', () => {
    const setAppliedFilters = vi.fn();

    render(
      <MilestoneFilterTags
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
      />
    );

    const categoryRemoveButton = screen.getByRole('button', {
      name: 'Remove Category 1 filter'
    });
    fireEvent.click(categoryRemoveButton);

    expect(setAppliedFilters).toHaveBeenCalledWith({
      categoryName: [],
      facilitatedByRole: [MtoFacilitator.MODEL_TEAM]
    });

    const clearAllButton = screen.getByRole('button', {
      name: i18next.t('general:filter.clearAll')
    });
    fireEvent.click(clearAllButton);

    expect(setAppliedFilters).toHaveBeenCalledWith({
      categoryName: [],
      facilitatedByRole: []
    });
  });
});
