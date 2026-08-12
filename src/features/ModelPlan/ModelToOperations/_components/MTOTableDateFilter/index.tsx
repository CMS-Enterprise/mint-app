import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Select } from '@trussworks/react-uswds';

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

  const dateFilterOptions = useMemo(() => {
    return Object.keys(neededWithinDateOptionsConfig).map(option => ({
      label: neededWithinDateOptionsConfig[option],
      value: convertToUppercaseAndUnderscore(option)
    }));
  }, [neededWithinDateOptionsConfig]);

  const selectedDropdownValue = useMemo(() => {
    if (!selectedFilters || selectedFilters.length === 0) return 'ALL_TIME';

    if (selectedFilters.length === 2) return 'CUSTOM_DATE_RANGE';

    const selectedValue = selectedFilters[0];

    if (
      selectedValue === 'CUSTOM_DATE_RANGE' ||
      dateFilterOptions.some(opt => opt.value === selectedValue)
    ) {
      return selectedValue;
    }

    return 'CUSTOM_DATE_RANGE';
  }, [selectedFilters, dateFilterOptions]);

  const disableCustomRange = selectedDropdownValue !== 'CUSTOM_DATE_RANGE';

  const startDate =
    disableCustomRange || selectedFilters[0] === 'CUSTOM_DATE_RANGE'
      ? undefined
      : selectedFilters[0];
  const endDate = disableCustomRange ? undefined : selectedFilters[1];

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    setSelectedFilters([selectedOption]);
  };

  const handleCustomDateChange = (
    isStart: boolean,
    date: string | undefined
  ) => {
    const newDate = date || '';
    const currentStart = startDate || '';
    const currentEnd = endDate || '';

    if (isStart) {
      setSelectedFilters([newDate, currentEnd]);
    } else {
      setSelectedFilters([currentStart, newDate]);
    }
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
            id="startDate"
            name="startDate"
            defaultValue={startDate}
            onChange={date => handleCustomDateChange(true, date)}
            disabled={disableCustomRange}
            suppressMilliseconds
          />
        </Grid>

        <Grid col={5}>
          <label htmlFor="endDate" className="text-bold margin-bottom-1">
            {generalT('datePicker.toDate')}
          </label>

          <p className="margin-0 text-base">{generalT('datePicker.format')}</p>

          <DatePickerFormatted
            id="endDate"
            name="endDate"
            defaultValue={endDate}
            onChange={date => handleCustomDateChange(false, date)}
            disabled={disableCustomRange}
            suppressMilliseconds
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default MTOTableDateFilter;
