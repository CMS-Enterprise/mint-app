import { ModelStatus } from 'gql/generated/graphql';
import i18next from 'i18next';

import { FilterGroupType } from 'components/FilterGroup';
import { tObject } from 'utils/translation';

export const getAllModelFilters = (): FilterGroupType[] => {
  const statusOptions = Object.entries(
    tObject<string>('modelPlan:status.options')
  );

  const otherOptions = Object.entries(
    tObject<string>(
      'analytics:configureDownload.basicFilterOptions.other.options'
    )
  );

  return [
    {
      key: 'status',
      label: i18next.t(
        `analytics:configureDownload.basicFilterOptions.status.label`
      ),
      options: statusOptions.map(([value, label]) => ({
        label,
        value
      })),
      tagLabel: '',
      displayShowAll: false
    },
    {
      key: 'other',
      label: i18next.t(
        `analytics:configureDownload.basicFilterOptions.other.label`
      ),
      options: otherOptions.map(([value, label]) => ({
        label,
        value
      })),
      tagLabel: '',
      displayShowAll: false
    }
  ];
};

export const getBasicModelFilters = () => {
  const allFilters = getAllModelFilters();

  return allFilters.map(filterGroup => {
    if (filterGroup.key === 'status') {
      return {
        ...filterGroup,
        options: filterGroup.options?.filter(
          option =>
            option.value !== ModelStatus.ENDED &&
            option.value !== ModelStatus.PAUSED &&
            option.value !== ModelStatus.CANCELED
        )
      };
    }

    return filterGroup;
  });
};
