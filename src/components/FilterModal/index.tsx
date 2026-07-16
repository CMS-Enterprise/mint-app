import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { Button, Checkbox, Fieldset, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';

type FilterGroupType = {
  key: string;
  label: string;
  fieldLabel: string;
  options: {
    label: string;
    value: string;
  }[];
  displayShowAll: boolean;
};

type FilterModalProps<T extends Record<string, unknown[]>> = {
  filters: FilterGroupType[];
  appliedFilters: T;
  setAppliedFilters: (filters: T) => void;
};

type FilterGroupProps = {
  filterGroup: FilterGroupType;
  selectedFilters: unknown[];
  setSelectedFilters: (filters: unknown[]) => void;
};

/**
 * This component displays a modal that allows the user to filter data by a given set of categories and filter options.
 *
 * Includes the "Filter" button to open the modal.
 */
const FilterModal = <T extends Record<string, unknown[]>>({
  filters,
  appliedFilters,
  setAppliedFilters
}: FilterModalProps<T>) => {
  const { t } = useTranslation('general');
  const [isOpen, setIsOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState<T>(appliedFilters);

  const emptyFilters = Object.keys(appliedFilters).reduce((acc, filterKey) => {
    return { ...acc, [filterKey]: [] };
  }, {} as T);

  useEffect(() => {
    if (isOpen) {
      setSelectedFilters(appliedFilters);
    }
  }, [isOpen, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters(selectedFilters);
    setIsOpen(false);
  };

  const appliedFiltersCount = Object.values(selectedFilters).reduce(
    (count, filtersArray) => count + filtersArray.length,
    0
  );

  const isApplyDisabled = Object.keys(appliedFilters).every(key => {
    const selected = selectedFilters[key];
    const applied = appliedFilters[key];

    return (
      selected.length === applied.length &&
      selected.every(val => applied.includes(val))
    );
  });

  const applyFiltersLabel =
    appliedFiltersCount < 2
      ? t('filter.applyFilter')
      : t('filter.applyFilterWithCount', { count: appliedFiltersCount });

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} outline>
        <Icon.FilterList aria-hidden />
        {t('filter.title')}
      </Button>

      <ReactModal
        isOpen={isOpen}
        overlayClassName={classNames('mint-modal__overlay')}
        className={classNames('mint-modal__content', 'mint-filter-modal')}
        onRequestClose={() => setIsOpen(false)}
        shouldCloseOnOverlayClick={false}
        appElement={document.getElementById('root')!}
      >
        <div className="mint-body-normal">
          <div
            className={classNames(
              'display-flex flex-align-center text-base padding-y-1 padding-left-3 padding-right-1 border-bottom-1px border-base-lighter'
            )}
          >
            <h4 className="margin-bottom-0 margin-top-05">
              {t('filter.title')}
            </h4>

            <button
              type="button"
              className="mint-modal__x-button text-base"
              aria-label="Close Modal"
              data-testid="close-icon"
              onClick={() => setIsOpen(false)}
            >
              <Icon.Close size={4} aria-label="close" />
            </button>
          </div>

          <div
            className="padding-y-2 padding-x-3 overflow-y-auto"
            style={{ maxHeight: '600px' }}
          >
            {filters.map(filter => (
              <FilterGroup
                key={filter.key}
                filterGroup={filter}
                selectedFilters={selectedFilters[filter.key]}
                setSelectedFilters={selectedFilterOptions =>
                  setSelectedFilters(prevSelectedFilters => ({
                    ...prevSelectedFilters,
                    [filter.key]: selectedFilterOptions
                  }))
                }
              />
            ))}
          </div>

          <div className="border-top-1px border-base-lighter padding-y-2 padding-x-3 display-flex flex-justify">
            <Button
              type="button"
              unstyled
              onClick={() => setSelectedFilters(emptyFilters)}
            >
              {t('filter.clearAll')}
            </Button>

            <Button
              type="button"
              onClick={handleApplyFilters}
              disabled={isApplyDisabled}
            >
              {applyFiltersLabel}
            </Button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

/**
 * Displays a filter group with checkboxes or time pickers for each option.
 */
const FilterGroup = ({
  filterGroup,
  selectedFilters,
  setSelectedFilters
}: FilterGroupProps) => {
  const { t } = useTranslation('general');

  /**
   * Determines if the "Show All" checkbox should be checked based on the selected filters.
   * @returns true if all options in group are selected and `filterGroup.displayShowAll` is true.
   */
  const showAllIsChecked = useMemo(
    () =>
      filterGroup.displayShowAll &&
      selectedFilters.length === filterGroup.options.length,
    [
      filterGroup.displayShowAll,
      selectedFilters.length,
      filterGroup.options.length
    ]
  );

  const handleSetShowAll = (value: boolean) => {
    if (value) {
      setSelectedFilters(filterGroup.options.map(option => option.value));
    } else {
      setSelectedFilters([]);
    }
  };

  const toggleFilterOption = (option: string) => {
    if (selectedFilters.includes(option)) {
      setSelectedFilters(selectedFilters.filter(filter => filter !== option));
    } else {
      setSelectedFilters([...selectedFilters, option]);
    }
  };

  return (
    <Fieldset className="mint-filter-group font-body-sm margin-bottom-2 border-bottom-1px border-base-light padding-bottom-4">
      <legend>
        <h3 className="margin-y-1">
          {t('filter.filterGroupHeading', { groupName: filterGroup.label })}
        </h3>
      </legend>

      <HelpText>
        {t('filter.filterGroupDescription', {
          groupName: filterGroup.fieldLabel
        })}
      </HelpText>

      <FieldGroup
        className={classNames('mint-filter-group__options margin-top-105', {
          'grid-row': filterGroup.displayShowAll
        })}
      >
        {filterGroup.displayShowAll && (
          <Checkbox
            className="grid-col-12 bg-none"
            id={`${filterGroup.key}-show-all`}
            name={`${filterGroup.key}-show-all`}
            onChange={() => handleSetShowAll(!showAllIsChecked)}
            label={t('filter.showAll')}
            checked={showAllIsChecked}
          />
        )}

        {filterGroup.options.map(option => (
          <Checkbox
            className={classNames({
              'grid-col-6 padding-right-05 bg-transparent':
                filterGroup.displayShowAll
            })}
            key={option.value}
            id={option.value}
            name={option.value}
            onChange={() => toggleFilterOption(option.value)}
            label={option.label}
            value={option.value}
            checked={showAllIsChecked || selectedFilters.includes(option.value)}
            disabled={showAllIsChecked}
          />
        ))}
      </FieldGroup>
    </Fieldset>
  );
};

export default FilterModal;
