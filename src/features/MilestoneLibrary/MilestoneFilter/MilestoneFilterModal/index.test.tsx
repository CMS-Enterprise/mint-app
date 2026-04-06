import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MtoFacilitator } from 'gql/generated/graphql';

import { MilestoneFilters } from './getMilestoneFilters';
import MilestoneFilterModal, { MilestoneSelectedFilters } from '.';

describe('MilestoneFilterModal', () => {
  const mockFilters: MilestoneFilters = [
    {
      key: 'categoryName',
      label: 'primary category',
      fieldLabel: 'Category',
      options: [
        { label: 'Category 1', value: 'Category 1' },
        { label: 'Category 2', value: 'Category 2' }
      ],
      displayShowAll: true
    },
    {
      key: 'facilitatedByRole',
      label: 'role',
      fieldLabel: 'Facilitated by role',
      options: [
        { label: 'Model team', value: MtoFacilitator.MODEL_TEAM },
        { label: 'IT Lead', value: MtoFacilitator.IT_LEAD }
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

    const openButton = screen.getByRole('button', { name: 'Filter' });
    fireEvent.click(openButton);

    expect(screen.getByRole('heading', { name: 'Filter' })).toBeInTheDocument();

    const closeButton = screen.getByTestId('close-icon');
    fireEvent.click(closeButton);

    expect(
      screen.queryByRole('heading', { name: 'Filter' })
    ).not.toBeInTheDocument();
  });

  it('clears filters when Clear All is clicked', () => {
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

    const openButton = screen.getByRole('button', { name: 'Filter' });
    fireEvent.click(openButton);

    expect(screen.getByRole('checkbox', { name: 'Category 1' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Model team' })).toBeChecked();

    const clearButton = screen.getByRole('button', { name: 'Clear all' });
    fireEvent.click(clearButton);

    expect(
      screen.getByRole('checkbox', { name: 'Category 1' })
    ).not.toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Model team' })
    ).not.toBeChecked();
  });

  it('applies current filters and closes modal when Apply Filter is clicked', () => {
    render(
      <MilestoneFilterModal
        filters={mockFilters}
        appliedFilters={defaultAppliedFilters}
        setAppliedFilters={setAppliedFilters}
      />
    );

    const openButton = screen.getByRole('button', { name: 'Filter' });
    fireEvent.click(openButton);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Category 1' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Model team' }));

    const applyButton = screen.getByRole('button', { name: 'Apply 2 filters' });
    fireEvent.click(applyButton);

    expect(setAppliedFilters).toHaveBeenCalledWith({
      categoryName: ['Category 1'],
      facilitatedByRole: [MtoFacilitator.MODEL_TEAM]
    });
    expect(
      screen.queryByRole('heading', { name: 'Filter' })
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

    const openButton = screen.getByRole('button', { name: 'Filter' });
    fireEvent.click(openButton);

    const showAllCheckbox = screen.getByRole('checkbox', {
      name: 'Show all'
    });
    fireEvent.click(showAllCheckbox);

    const applyButton = screen.getByRole('button', { name: 'Apply 2 filters' });
    fireEvent.click(applyButton);

    expect(setAppliedFilters).toHaveBeenCalledWith({
      categoryName: ['Category 1', 'Category 2'],
      facilitatedByRole: []
    });
  });

  it('displays Apply filter when 0 or 1 filter is selected', () => {
    render(
      <MilestoneFilterModal
        filters={mockFilters}
        appliedFilters={defaultAppliedFilters}
        setAppliedFilters={setAppliedFilters}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Filter' }));

    expect(
      screen.getByRole('button', { name: 'Apply filter' })
    ).toBeInTheDocument();
  });

  it('displays apply button with filter count when 2+ filters are selected', () => {
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
    fireEvent.click(screen.getByRole('button', { name: 'Filter' }));

    expect(
      screen.getByRole('button', { name: 'Apply 2 filters' })
    ).toBeInTheDocument();
  });
});
