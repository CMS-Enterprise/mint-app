import { GetMtoCategoriesQuery, MtoFacilitator } from 'gql/generated/graphql';
import i18next from 'i18next';

import { FilterGroupType } from 'components/FilterGroup';
import { tArray, tObject } from 'utils/translation';

type Category =
  GetMtoCategoriesQuery['modelPlan']['mtoMatrix']['categories'][0];

const BASE_I18N = 'modelToOperationsMisc:table.tableFilters.filterOptions';

const buildFilterGroup = (
  key: string,
  filedKey: string,
  options: { label: string; value: string }[],
  displayShowAll: boolean = false
): FilterGroupType => ({
  key,
  label: i18next.t(`${BASE_I18N}.${filedKey}.label`),
  description: i18next.t(`${BASE_I18N}.${filedKey}.description`),
  tagLabel: i18next.t(`${BASE_I18N}.${filedKey}.tagLabel`),
  options,
  displayShowAll
});

const formatOptionsFromI18n = (obj: Record<string, string>, basePath: string) =>
  Object.keys(obj).map(key => ({
    label: i18next.t(`${basePath}.${key}`),
    value: key
  }));

/**
 * Returns the MTO milestone table filter options
 */
const getMTOTableFilters = (categories: Category[]): FilterGroupType[] => {
  const categoryWithNames = categories.filter(
    category => category.name !== 'Uncategorized'
  );
  const categoryNames = categoryWithNames.map(category => category.name);
  const uniqueCategoryNames = [...new Set(categoryNames)].sort((a, b) =>
    a.localeCompare(b)
  );

  const categoryOptions = uniqueCategoryNames.map(name => ({
    label: name,
    value: name
  }));

  const facilitatedByOptions = formatOptionsFromI18n(
    tObject<MtoFacilitator>('mtoMilestone:facilitatedBy.options'),
    'mtoMilestone:facilitatedBy.options'
  );

  const statusOptions = formatOptionsFromI18n(
    tObject<string>('mtoMilestone:status.options'),
    'mtoMilestone:status.options'
  );

  const riskIndicatorOptions = formatOptionsFromI18n(
    tObject<string>('mtoMilestone:riskIndicator.options'),
    'mtoMilestone:riskIndicator.options'
  );

  const otherFilterOptions = tArray<string>(
    `${BASE_I18N}.otherFilters.options`
  ).map(filter => ({ label: filter, value: filter }));

  return [
    buildFilterGroup('categoryName', 'primaryCategory', categoryOptions, true),
    buildFilterGroup(
      'facilitatedByRole',
      'facilitatedByRole',
      facilitatedByOptions
    ),
    buildFilterGroup('status', 'status', statusOptions),
    buildFilterGroup('riskIndicator', 'riskIndicator', riskIndicatorOptions),
    buildFilterGroup('otherFilters', 'otherFilters', otherFilterOptions)
  ];
};

export default getMTOTableFilters;
