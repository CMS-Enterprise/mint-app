import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MtoFacilitator } from 'gql/generated/graphql';

import { MilestoneFilters } from './getMilestoneFilters';
import MilestoneFilterModal, { MilestoneSelectedFilters } from '.';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('MilestoneFilterModal', () => {
  const mockFilters: MilestoneFilters = [
    {
      key: 'categoryName',
      label: 'filters.categoryName.label',
      fieldLabel: 'filters.categoryName.fieldLabel',
      options: [
        { label: 'Category 1', value: 'Category 1' },
        { label: 'Category 2', value: 'Category 2' }
      ],
      displayShowAll: true
    },
    {
      key: 'facilitatedByRole',
      label: 'filters.facilitatedByRole.label',
      fieldLabel: 'filters.facilitatedByRole.fieldLabel',
      options: [
        { label: 'Role A', value: MtoFacilitator.MODEL_TEAM },
        { label: 'Role B', value: MtoFacilitator.IT_LEAD }
      ],
      displayShowAll: false
    }
  ];

  const defaultAppliedFilters: MilestoneSelectedFilters = {
    categoryName: [],
    facilitatedByRole: []
  };

  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
  console.error = vi.fn();

  let setAppliedFilters: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    setAppliedFilters = vi.fn();
  });

  it('opens and closes the modal from filter button and close icon', () => {
    render(
      <MilestoneFilterModal
        filters={mockFilters}
        appliedFilters={defaultAppliedFilters}
        setAppliedFilters={vi.fn()}
      />
    );

    const openButton = screen.getByRole('button', { name: 'filter.title' });
    fireEvent.click(openButton);

    expect(
      screen.getByRole('heading', { name: 'filter.title' })
    ).toBeInTheDocument();

    const closeButton = screen.getByTestId('close-icon');
    fireEvent.click(closeButton);

    expect(
      screen.queryByRole('heading', { name: 'filter.title' })
    ).not.toBeInTheDocument();
  });

  it('clears filters and closes modal when Clear All is clicked', () => {
    const appliedFilters: MilestoneSelectedFilters = {
      categoryName: ['Category 1'],
      facilitatedByRole: [MtoFacilitator.MODEL_TEAM]
    };

    render(
      <MilestoneFilterModal
        filters={mockFilters}
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
      />
    );

    const openButton = screen.getByRole('button', { name: 'filter.title' });
    fireEvent.click(openButton);

    const clearButton = screen.getByRole('button', { name: 'filter.clearAll' });
    fireEvent.click(clearButton);

    expect(setAppliedFilters).toHaveBeenCalledWith({
      categoryName: [],
      facilitatedByRole: []
    });
    expect(
      screen.queryByRole('heading', { name: 'filter.title' })
    ).not.toBeInTheDocument();
  });

  it('applies current filters and closes modal when Apply Filter is clicked', () => {
    const appliedFilters: MilestoneSelectedFilters = {
      categoryName: ['Category 1'],
      facilitatedByRole: [MtoFacilitator.MODEL_TEAM]
    };

    render(
      <MilestoneFilterModal
        filters={mockFilters}
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
      />
    );

    const openButton = screen.getByRole('button', { name: 'filter.title' });
    fireEvent.click(openButton);

    const applyButton = screen.getByRole('button', {
      name: 'filter.applyFilter'
    });
    fireEvent.click(applyButton);

    expect(setAppliedFilters).toHaveBeenCalledWith(appliedFilters);
    expect(
      screen.queryByRole('heading', { name: 'filter.title' })
    ).not.toBeInTheDocument();
  });

  it('selects all options in a group when Show all is checked and applies them', () => {
    render(
      <MilestoneFilterModal
        filters={mockFilters}
        appliedFilters={defaultAppliedFilters}
        setAppliedFilters={setAppliedFilters}
      />
    );

    const openButton = screen.getByRole('button', { name: 'filter.title' });
    fireEvent.click(openButton);

    const showAllCheckbox = screen.getByRole('checkbox', {
      name: 'filter.showAll'
    });
    fireEvent.click(showAllCheckbox);

    const applyButton = screen.getByRole('button', {
      name: 'filter.applyFilter'
    });
    fireEvent.click(applyButton);

    expect(setAppliedFilters).toHaveBeenCalledWith({
      categoryName: ['Category 1', 'Category 2'],
      facilitatedByRole: []
    });
  });
});
