import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '@trussworks/react-uswds';

import { convertToUppercaseAndUnderscore } from 'utils/modelPlan';
import { tObject } from 'utils/translation';

const MilestoneDateSelect = ({
  selectedFilters,
  setSelectedFilters
}: {
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
}) => {
  const { t: analyticsT } = useTranslation('analytics');

  const neededWithinDateOptionsConfig = tObject<string>(
    'analytics:configureDownload.otherFilterOptions.neededByDateRange.options'
  );

  const dateFilterOptions = useMemo(() => {
    return Object.keys(neededWithinDateOptionsConfig).map(option => ({
      label: neededWithinDateOptionsConfig[option],
      value: convertToUppercaseAndUnderscore(option)
    }));
  }, [neededWithinDateOptionsConfig]);

  return (
    <div>
      <Select
        className="margin-top-3 tablet:grid-col-8"
        id="milestone-needed-date-select"
        data-testid="milestone-needed-date-select"
        aria-label={analyticsT(
          'configureDownload.otherFilterOptions.neededByDateRange.label'
        )}
        name="milestoneDate"
        value={selectedFilters[0] || 'ALL_TIME'}
        onChange={e => {
          setSelectedFilters(
            e.target.value === 'ALL_TIME' ? [] : [e.target.value]
          );
        }}
      >
        {dateFilterOptions.map(({ value, label }) => (
          <option key={`milestone-needed-date-select-${value}`} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default MilestoneDateSelect;
