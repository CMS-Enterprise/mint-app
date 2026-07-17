import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MtoFacilitator } from 'gql/generated/graphql';
import i18next from 'i18next';

import { FilterGroupType } from 'components/FilterGroup';

import FilterTags from '.';

const filters: FilterGroupType[] = [
  {
    key: 'categoryName',
    label: 'primary category',
    description: 'This filters by the "Category" field.',
    tagLabel: 'Category',
    options: [
      { label: 'Category 1', value: 'Category 1' },
      { label: 'Category 2', value: 'Category 2' }
    ],
    displayShowAll: true
  },
  {
    key: 'facilitatedByRole',
    label: 'role',
    description: 'This filters by the "Facilitated by" field.',
    tagLabel: 'Role',
    options: [
      { label: 'Model team', value: MtoFacilitator.MODEL_TEAM },
      { label: 'IT Lead', value: MtoFacilitator.IT_LEAD }
    ],
    displayShowAll: false
  }
];

const appliedFilters = {
  categoryName: ['Category 1'],
  facilitatedByRole: [MtoFacilitator.MODEL_TEAM]
};

describe('FilterTags', () => {
  const defaultAppliedFilters = {
    categoryName: [],
    facilitatedByRole: []
  };

  it('does not render when no filters are applied', () => {
    const { container } = render(
      <FilterTags
        filters={filters}
        appliedFilters={defaultAppliedFilters}
        setAppliedFilters={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('displays applied filters and clear all button', () => {
    render(
      <FilterTags
        filters={filters}
        appliedFilters={appliedFilters}
        setAppliedFilters={vi.fn()}
      />
    );

    // Renders the filters count
    expect(screen.getByText('Filters (2)')).toBeInTheDocument();

    expect(
      screen.getByRole('listitem', { name: 'Category: Category 1' })
    ).toBeInTheDocument();

    // Maps the applied value to its option label
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
      <FilterTags
        filters={filters}
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
