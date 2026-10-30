import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '@trussworks/react-uswds';
import { groupOptions } from 'features/ModelPlan/ReadOnly/_components/FilterView/util';

const FilteredViewSelect = ({
  selectedFilters,
  setSelectedFilters
}: {
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
}) => {
  const { t: analyticsT } = useTranslation('analytics');

  return (
    <div>
      <Select
        className="margin-top-3 "
        id="filtered-view-select"
        data-testid="filtered-view-select"
        aria-label={analyticsT(
          'configureDownload.otherFilterOptions.filteredView.label'
        )}
        name="filtered-view"
        value={selectedFilters[0] || 'default'}
        onChange={e => {
          setSelectedFilters([e.target.value]);
        }}
      >
        <option value="default">
          {analyticsT('configureDownload.selectOptionDefault')}
        </option>

        {groupOptions.map(({ value, label }) => (
          <option key={`filter-view-${value}`} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default FilteredViewSelect;
