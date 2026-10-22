import i18next from 'i18next';

import { FilterGroupType } from 'components/FilterGroup';
import { tObject } from 'utils/translation';

const getBasicFilters = (): FilterGroupType[] => {
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

export default getBasicFilters;
