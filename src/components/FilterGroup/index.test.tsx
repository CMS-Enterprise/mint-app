import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MtoFacilitator } from 'gql/generated/graphql';
import i18next from 'i18next';

import FilterGroup, { FilterGroupType } from '.';

const filterGroup: FilterGroupType = {
  key: 'categoryName',
  label: 'primary category',
  description: 'This filters by the "Category" field.',
  tagLabel: 'Category',
  options: [
    { label: 'Category 1', value: 'Category 1' },
    { label: 'Category 2', value: 'Category 2' }
  ],
  displayShowAll: true
};

const filterGroupWithoutShowAll: FilterGroupType = {
  key: 'facilitatedByRole',
  label: 'role',
  description: 'This filters by the "Facilitated by" field.',
  tagLabel: 'Role',
  options: [
    { label: 'Model team', value: MtoFacilitator.MODEL_TEAM },
    { label: 'IT Lead', value: MtoFacilitator.IT_LEAD }
  ],
  displayShowAll: false
};

describe('FilterGroup', () => {
  it('renders group heading, description, and checkboxes', () => {
    render(
      <FilterGroup
        filterGroup={filterGroup}
        selectedFilters={[]}
        setSelectedFilters={vi.fn()}
      />
    );

    expect(
      screen.getByRole('heading', {
        name: i18next.t('general:filter.filterGroupHeading', {
          groupName: filterGroup.label
        })
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText('This filters by the "Category" field.')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('checkbox', { name: 'Category 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Category 2' })
    ).toBeInTheDocument();
  });

  it('selects an option when checkbox is clicked', () => {
    const setSelectedFilters = vi.fn();

    render(
      <FilterGroup
        filterGroup={filterGroup}
        selectedFilters={[]}
        setSelectedFilters={setSelectedFilters}
      />
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Category 1' }));

    expect(setSelectedFilters).toHaveBeenCalledWith(['Category 1']);
  });

  it('unselects an option when checkbox is clicked', () => {
    const setSelectedFilters = vi.fn();

    render(
      <FilterGroup
        filterGroup={filterGroup}
        selectedFilters={['Category 1']}
        setSelectedFilters={setSelectedFilters}
      />
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Category 1' }));

    expect(setSelectedFilters).toHaveBeenCalledWith([]);
  });

  it('renders Show all checkbox when displayShowAll is true', () => {
    render(
      <FilterGroup
        filterGroup={filterGroup}
        selectedFilters={[]}
        setSelectedFilters={vi.fn()}
      />
    );

    expect(
      screen.getByRole('checkbox', {
        name: i18next.t('general:filter.showAll')
      })
    ).toBeInTheDocument();
  });

  it('does not render Show all checkbox when displayShowAll is false', () => {
    render(
      <FilterGroup
        filterGroup={filterGroupWithoutShowAll}
        selectedFilters={[]}
        setSelectedFilters={vi.fn()}
      />
    );

    expect(
      screen.queryByRole('checkbox', {
        name: i18next.t('general:filter.showAll')
      })
    ).not.toBeInTheDocument();
  });

  it('Show All checkbox selects all options when checked', () => {
    const setSelectedFilters = vi.fn();

    render(
      <FilterGroup
        filterGroup={filterGroup}
        selectedFilters={[]}
        setSelectedFilters={setSelectedFilters}
      />
    );

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: i18next.t('general:filter.showAll')
      })
    );

    expect(setSelectedFilters).toHaveBeenCalledWith([
      'Category 1',
      'Category 2'
    ]);
  });

  it('checks Show all when all options are selected and displayShowAll is true', () => {
    render(
      <FilterGroup
        filterGroup={filterGroup}
        selectedFilters={['Category 1', 'Category 2']}
        setSelectedFilters={vi.fn()}
      />
    );

    expect(
      screen.getByRole('checkbox', {
        name: i18next.t('general:filter.showAll')
      })
    ).toBeChecked();
  });
});
