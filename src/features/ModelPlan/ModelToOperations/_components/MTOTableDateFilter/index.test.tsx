import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import MTOTableDateFilter from '.';

describe('MTOTableDateFilter Component', () => {
  let setSelectedFilters: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setSelectedFilters = vi.fn();
  });

  const getStartDateInput = () =>
    document.querySelector('#startDate') as HTMLInputElement;

  const getEndDateInput = () =>
    document.querySelector('#endDate') as HTMLInputElement;

  it('renders dropdown with default "ALL_TIME" value and disabled datepickers', () => {
    render(
      <MTOTableDateFilter
        selectedFilters={[]}
        setSelectedFilters={setSelectedFilters}
      />
    );

    const select = screen.getByTestId(
      'mto-filter-by-date'
    ) as HTMLSelectElement;
    expect(select.value).toBe('ALL_TIME');

    expect(getStartDateInput()).toBeDisabled();
    expect(getEndDateInput()).toBeDisabled();
  });

  it('calls setSelectedFilters with empty array when "ALL_TIME" option is selected', async () => {
    const user = userEvent.setup();

    render(
      <MTOTableDateFilter
        selectedFilters={['NEXT_30_DAYS']}
        setSelectedFilters={setSelectedFilters}
      />
    );

    const select = screen.getByTestId('mto-filter-by-date');
    await user.selectOptions(select, 'ALL_TIME');

    expect(setSelectedFilters).toHaveBeenCalledWith([]);
  });

  it('calls setSelectedFilters with single filter when a preset date option is selected', async () => {
    const user = userEvent.setup();

    render(
      <MTOTableDateFilter
        selectedFilters={[]}
        setSelectedFilters={setSelectedFilters}
      />
    );

    const select = screen.getByTestId('mto-filter-by-date');
    await user.selectOptions(select, 'NEXT_30_DAYS');

    expect(setSelectedFilters).toHaveBeenCalledWith(['NEXT_30_DAYS']);
  });

  it('calls setSelectedFilters with ["", ""] when "CUSTOM_DATE_RANGE" is selected', async () => {
    const user = userEvent.setup();

    render(
      <MTOTableDateFilter
        selectedFilters={[]}
        setSelectedFilters={setSelectedFilters}
      />
    );

    const select = screen.getByTestId('mto-filter-by-date');
    await user.selectOptions(select, 'CUSTOM_DATE_RANGE');

    expect(setSelectedFilters).toHaveBeenCalledWith(['', '']);
  });

  it('enables date pickers and populates values in custom mode', () => {
    render(
      <MTOTableDateFilter
        selectedFilters={['2026-01-01', '2026-02-01']}
        setSelectedFilters={setSelectedFilters}
      />
    );

    const select = screen.getByTestId(
      'mto-filter-by-date'
    ) as HTMLSelectElement;
    expect(select.value).toBe('CUSTOM_DATE_RANGE');

    const startPicker = getStartDateInput();
    const endPicker = getEndDateInput();

    expect(startPicker).not.toBeDisabled();
    expect(endPicker).not.toBeDisabled();
    expect(startPicker.value).toBe('01/01/2026');
    expect(endPicker.value).toBe('02/01/2026');
  });

  it('updates start date and calls setSelectedFilters with formatted ISO date string', async () => {
    const user = userEvent.setup();

    render(
      <MTOTableDateFilter
        selectedFilters={['', '2026-02-01']}
        setSelectedFilters={setSelectedFilters}
      />
    );

    const startPicker = getStartDateInput();
    await user.clear(startPicker);
    await user.type(startPicker, '01/15/2026');

    expect(setSelectedFilters).toHaveBeenCalled();
  });

  it('updates end date and calls setSelectedFilters', async () => {
    const user = userEvent.setup();

    render(
      <MTOTableDateFilter
        selectedFilters={['2026-01-01', '']}
        setSelectedFilters={setSelectedFilters}
      />
    );

    const endPicker = getEndDateInput();
    await user.clear(endPicker);
    await user.type(endPicker, '02/28/2026');

    expect(setSelectedFilters).toHaveBeenCalled();
  });
});
