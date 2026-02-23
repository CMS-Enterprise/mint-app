import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Fieldset } from '@trussworks/react-uswds';
import classNames from 'classnames';

import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';

import { MilestoneFilter } from './getMilestoneFilters';

type MilestoneFilterGroupProps = {
  filterGroup: MilestoneFilter;
};

const MilestoneFilterGroup = ({ filterGroup }: MilestoneFilterGroupProps) => {
  const { t } = useTranslation('general');

  const [showAll, setShowAll] = useState<boolean>(false);

  return (
    <Fieldset className="mint-filter-group font-body-sm margin-bottom-2 border-bottom-1px border-base-light padding-bottom-4">
      <legend>
        <h3 className="margin-y-1">
          {t('filter.filterGroupHeading', { groupName: filterGroup.label })}
        </h3>
      </legend>
      <HelpText>
        {t('filter.filterGroupDescription', { groupName: filterGroup.label })}
      </HelpText>
      <FieldGroup
        className={classNames('mint-filter-group__options margin-top-105', {
          'grid-row': filterGroup.displayShowAll
        })}
      >
        {filterGroup.displayShowAll && (
          <Checkbox
            className="grid-col-12 bg-none"
            id="show-all"
            name="show-all"
            onChange={() => setShowAll(!showAll)}
            label={t('filter.showAll')}
            checked={showAll}
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
            onChange={() => {}}
            onBlur={() => {}}
            label={option.label}
            value={option.value}
            checked={showAll}
            disabled={filterGroup.displayShowAll && showAll}
          />
        ))}
      </FieldGroup>
    </Fieldset>
  );
};

export default MilestoneFilterGroup;
