import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Select } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import DatePickerFormatted from 'components/DatePickerFormatted';
import { convertToUppercaseAndUnderscore } from 'utils/modelPlan';
import { tObject } from 'utils/translation';

import { DATE_FILTER_PARAM } from '../MTOTableFilters';

const MTOTableDateFilter = ({
  selectedFilters,
  setSelectedFilters
}: {
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
}) => {
  const { t: generalT } = useTranslation('general');

  const neededWithinDateOptionsConfig = tObject<string>(
    'modelToOperationsMisc:table.tableFilters.filterOptions.neededByDateRange.options'
  );

  const isCustomMode = selectedFilters.length === 2;

  const customStart = isCustomMode ? selectedFilters[0] : '';
  const customEnd = isCustomMode ? selectedFilters[1] : '';

  let selectedDropdownValue = 'ALL_TIME';

  if (isCustomMode) {
    selectedDropdownValue = 'CUSTOM_DATE_RANGE';
  } else if (selectedFilters.length === 1) {
    // eslint-disable-next-line prefer-destructuring
    selectedDropdownValue = selectedFilters[0];
  }

  const dateFilterOptions = useMemo(() => {
    return Object.keys(neededWithinDateOptionsConfig).map(option => ({
      label: neededWithinDateOptionsConfig[option],
      value: convertToUppercaseAndUnderscore(option)
    }));
  }, [neededWithinDateOptionsConfig]);

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;

    if (selectedOption === 'CUSTOM_DATE_RANGE') {
      setSelectedFilters(['', '']);
    } else if (selectedOption === 'ALL_TIME') {
      setSelectedFilters([]);
    } else {
      setSelectedFilters([selectedOption]);
    }
  };

  const handleCustomDateChange = (
    isStart: boolean,
    date: string | undefined
  ) => {
    const dateOnly = date ? DateTime.fromISO(date).toISODate() : '';

    const newStart = isStart ? dateOnly || '' : customStart;
    const newEnd = !isStart ? dateOnly || '' : customEnd;

    setSelectedFilters([newStart, newEnd]);
  };

  return (
    <div>
      <Select
        className="margin-y-3 tablet:grid-col-8"
        id="mto-filter-by-date"
        data-testid="mto-filter-by-date"
        name={DATE_FILTER_PARAM}
        value={selectedDropdownValue}
        onChange={handleFilterTypeChange}
      >
        {dateFilterOptions.map(({ value, label }) => (
          <option key={`filter-by-date-${value}`} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <Grid row gap={2} className="margin-bottom-2">
        <Grid col={5}>
          <label htmlFor="startDate" className="text-bold margin-bottom-1">
            {generalT('datePicker.fromDate')}
          </label>

          <p className="margin-0 text-base">{generalT('datePicker.format')}</p>

          <DatePickerFormatted
            key={`start-${isCustomMode}`}
            id="startDate"
            name="startDate"
            defaultValue={customStart}
            onChange={date => handleCustomDateChange(true, date)}
            disabled={!isCustomMode}
            suppressMilliseconds
          />
        </Grid>

        <Grid col={5}>
          <label htmlFor="endDate" className="text-bold margin-bottom-1">
            {generalT('datePicker.toDate')}
          </label>

          <p className="margin-0 text-base">{generalT('datePicker.format')}</p>

          <DatePickerFormatted
            key={`end-${isCustomMode}`}
            id="endDate"
            name="endDate"
            defaultValue={customEnd}
            onChange={date => handleCustomDateChange(false, date)}
            disabled={!isCustomMode}
            suppressMilliseconds
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default MTOTableDateFilter;
