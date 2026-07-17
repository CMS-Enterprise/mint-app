import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { FilterGroupType } from 'components/FilterGroup';
import Tag from 'components/Tag';

type FilterTagProps = {
  label: string;
  value: string;
  onRemove: () => void;
};

/**
 * Displays a single filter tag with button to remove the filter.
 */
const FilterTag = ({ label, value, onRemove }: FilterTagProps) => {
  const { t: generalT } = useTranslation('general');

  return (
    <Tag className="mint-tag__select-tag">
      {label}:<span className="text-bold margin-left-05">{value}</span>
      <button
        type="button"
        className="margin-left-05 usa-button--unstyled pointer display-flex text-base-darkest"
        aria-label={generalT('filter.removeFilter', {
          filter: value
        })}
        onClick={onRemove}
      >
        <Icon.Close aria-hidden="true" />
      </button>
    </Tag>
  );
};

type FilterTagsProps<T extends Record<string, string[]>> = {
  filters: FilterGroupType[];
  appliedFilters: T;
  setAppliedFilters: (filters: T) => void;
  className?: string;
};

/**
 * Displays the currently applied filters as removable tags.
 */
const FilterTags = <T extends Record<string, string[]>>({
  filters,
  appliedFilters,
  setAppliedFilters,
  className
}: FilterTagsProps<T>) => {
  const { t: generalT } = useTranslation('general');

  const filtersCount = Object.values(appliedFilters).reduce(
    (count, values) => count + values.length,
    0
  );

  const emptyFilters = Object.keys(appliedFilters).reduce(
    (acc, filterKey) => ({ ...acc, [filterKey]: [] }),
    {} as T
  );

  const handleRemoveFilter = (filterKey: string, value: string) =>
    setAppliedFilters({
      ...appliedFilters,
      [filterKey]: appliedFilters[filterKey].filter(
        existingValue => existingValue !== value
      )
    });

  if (filtersCount === 0) {
    return null;
  }

  return (
    <div className={classNames('grid-col-12', className)}>
      <div className="display-flex flex-align-center margin-bottom-2">
        <p className="text-bold margin-0 margin-right-1">
          {generalT('filter.titlePlural')} ({filtersCount})
        </p>

        <Button
          type="button"
          className="margin-0"
          unstyled
          onClick={() => setAppliedFilters(emptyFilters)}
        >
          {generalT('filter.clearAll')}
        </Button>
      </div>

      <ul className="display-flex flex-wrap add-list-reset">
        {filters.flatMap(filter =>
          (appliedFilters[filter.key] ?? []).map(value => {
            const optionLabel =
              filter.options.find(option => option.value === value)?.label ??
              value;

            return (
              <li
                key={`${filter.key}-${value}`}
                aria-label={`${filter.tagLabel}: ${optionLabel}`}
              >
                <FilterTag
                  label={filter.tagLabel}
                  value={optionLabel}
                  onRemove={() => handleRemoveFilter(filter.key, value)}
                />
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default FilterTags;
