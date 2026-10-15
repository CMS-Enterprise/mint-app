import i18next from 'i18next';

import { FilterGroupType } from 'components/FilterGroup';
import { tObject } from 'utils/translation';

import type { CommonWaiverData } from '../..';

/**
 * Returns the common waiver library filter options
 */
const getCommonWaiverFilters = (
  commonWaivers: CommonWaiverData[]
): FilterGroupType[] => {
  // Extract unique values for each field
  const waiverTypes = commonWaivers.map(
    waiver => waiver.waiverType || 'UNKNOWN'
  );
  const uniqueWaiverType = [...new Set(waiverTypes)].sort();

  const waiverFocus = commonWaivers.map(waiver => waiver.waiverFocus);
  const uniqueWaiverFocus = [...new Set(waiverFocus.flat())].sort();

  const otherFilterOptions = tObject<string>(
    'waiverLibraryMisc:filterOptions.other.options'
  );

  return [
    {
      key: 'type',
      label: i18next.t('waiverLibraryMisc:filterOptions.type.label'),
      description: i18next.t(
        'waiverLibraryMisc:filterOptions.type.description'
      ),
      tagLabel: i18next.t('waiverLibraryMisc:filterOptions.type.tagLabel'),
      options: uniqueWaiverType.map(type => ({
        label: i18next.t(`waiverAssessmentSurveyMisc:${type}.heading`),
        value: type
      })),
      displayShowAll: false
    },
    {
      key: 'focus',
      label: i18next.t('waiverLibraryMisc:filterOptions.focus.label'),
      description: i18next.t(
        'waiverLibraryMisc:filterOptions.focus.description'
      ),
      tagLabel: i18next.t('waiverLibraryMisc:filterOptions.focus.tagLabel'),
      options: uniqueWaiverFocus.map(focus => ({
        label: focus,
        value: focus
      })),
      displayShowAll: false
    },
    {
      key: 'other',
      label: i18next.t('waiverLibraryMisc:filterOptions.other.label'),
      description: i18next.t(
        'waiverLibraryMisc:filterOptions.other.description'
      ),
      tagLabel: i18next.t('waiverLibraryMisc:filterOptions.other.tagLabel'),
      options: Object.entries(otherFilterOptions).map(([value, label]) => ({
        label,
        value
      })),
      displayShowAll: false
    }
  ];
};

export default getCommonWaiverFilters;
