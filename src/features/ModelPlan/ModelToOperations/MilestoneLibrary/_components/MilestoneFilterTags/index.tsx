import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { MtoFacilitator } from 'gql/generated/graphql';
import { upperFirst } from 'lodash';

import Tag from 'components/Tag';

import { MilestoneSelectedFilters } from '../MilestoneFilterModal';

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
        data-testid={`close-icon-${value}`}
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

type MilestoneFilterTagsProps = {
  appliedFilters: MilestoneSelectedFilters;
  setAppliedFilters: (filters: MilestoneSelectedFilters) => void;
  className?: string;
};

/**
 * Displays the currently applied milestone filters as removable tags.
 */
const MilestoneFilterTags = ({
  appliedFilters,
  setAppliedFilters,
  className
}: MilestoneFilterTagsProps) => {
  const { t: generalT } = useTranslation('general');
  const { t: hkcT } = useTranslation('helpAndKnowledge');
  const { t: milestoneT } = useTranslation('mtoMilestone');

  const { categoryName, facilitatedByRole } = appliedFilters;

  const handleRemoveCategory = (category: string) =>
    setAppliedFilters({
      ...appliedFilters,
      categoryName: appliedFilters.categoryName.filter(
        existingCategory => existingCategory !== category
      )
    });

  const handleRemoveRole = (role: MtoFacilitator) =>
    setAppliedFilters({
      ...appliedFilters,
      facilitatedByRole: appliedFilters.facilitatedByRole.filter(
        existingRole => existingRole !== role
      )
    });

  const filtersCount = categoryName.length + facilitatedByRole.length;

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
          onClick={() =>
            setAppliedFilters({
              categoryName: [],
              facilitatedByRole: []
            })
          }
        >
          {generalT('filter.clearAll')}
        </Button>
      </div>

      <ul className="display-flex flex-wrap add-list-reset">
        {categoryName.map(category => (
          <li key={category}>
            <FilterTag
              label={hkcT('milestoneLibrary.filters.category')}
              value={category}
              onRemove={() => handleRemoveCategory(category)}
            />
          </li>
        ))}
        {facilitatedByRole.map(role => (
          <li key={role}>
            <FilterTag
              label={upperFirst(hkcT('milestoneLibrary.filters.role'))}
              value={milestoneT(`facilitatedBy.options.${role}`)}
              onRemove={() => handleRemoveRole(role)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MilestoneFilterTags;
