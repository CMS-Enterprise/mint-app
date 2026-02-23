import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Fieldset } from '@trussworks/react-uswds';

import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';

import { MilestoneFilter } from './getMilestoneFilters';

type MilestoneFilterGroupProps = {
  filterGroup: MilestoneFilter;
};

const MilestoneFilterGroup = ({ filterGroup }: MilestoneFilterGroupProps) => {
  const { t } = useTranslation('general');

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
      <FieldGroup className="mint-filter-group__options margin-top-105">
        {filterGroup.options.map(option => (
          <Checkbox
            key={option.value}
            id={option.value}
            name={option.value}
            onChange={() => {}}
            onBlur={() => {}}
            label={option.label}
            value={option.value}
          />
        ))}
      </FieldGroup>
    </Fieldset>
  );
};

export default MilestoneFilterGroup;
