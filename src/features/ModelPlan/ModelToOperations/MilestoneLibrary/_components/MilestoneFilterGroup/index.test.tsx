import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MtoFacilitator } from 'gql/generated/graphql';
import i18next from 'i18next';

import { MilestoneFilter } from '../MilestoneFilterModal/getMilestoneFilters';

import MilestoneFilterGroup from '.';

const filterGroup: MilestoneFilter = {
  key: 'categoryName',
  label: 'primary category',
  fieldLabel: 'Category',
  options: [
    { label: 'Category 1', value: 'Category 1' },
    { label: 'Category 2', value: 'Category 2' }
  ],
  displayShowAll: true
};

const filterGroupWithoutShowAll: MilestoneFilter = {
  key: 'facilitatedByRole',
  label: 'role',
  fieldLabel: 'Facilitated by role',
  options: [
    { label: 'Model team', value: MtoFacilitator.MODEL_TEAM },
    { label: 'IT Lead', value: MtoFacilitator.IT_LEAD }
  ],
  displayShowAll: false
};

describe('MilestoneFilterGroup', () => {
  it('renders group heading, description, and checkboxes', () => {
    render(
      <MilestoneFilterGroup
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
      screen.getByText(
        i18next.t('general:filter.filterGroupDescription', {
          groupName: filterGroup.fieldLabel
        })
      )
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
      <MilestoneFilterGroup
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
      <MilestoneFilterGroup
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
      <MilestoneFilterGroup
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
      <MilestoneFilterGroup
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
      <MilestoneFilterGroup
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
      <MilestoneFilterGroup
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
