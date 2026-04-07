import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Fieldset } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { MtoFacilitator } from 'gql/generated/graphql';

import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';

import { MilestoneFilter } from '../MilestoneFilterModal/getMilestoneFilters';

type MilestoneFilterGroupProps = {
  filterGroup: MilestoneFilter;
  selectedFilters: (string | MtoFacilitator)[];
  setSelectedFilters: (filters: (string | MtoFacilitator)[]) => void;
};

/**
 * Displays a filter group with checkboxes for each option.
 */
const MilestoneFilterGroup = ({
  filterGroup,
  selectedFilters,
  setSelectedFilters
}: MilestoneFilterGroupProps) => {
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

  const toggleFilterOption = (option: string | MtoFacilitator) => {
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

export default MilestoneFilterGroup;
