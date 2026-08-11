import { GetMtoCategoriesQuery, MtoFacilitator } from 'gql/generated/graphql';
import i18next from 'i18next';

import { FilterGroupType } from 'components/FilterGroup';
import { tObject } from 'utils/translation';

type Category =
  GetMtoCategoriesQuery['modelPlan']['mtoMatrix']['categories'][0];

const BASE_I18N = 'modelToOperationsMisc:table.tableFilters.filterOptions';

const buildFilterGroup = (
  key: string,
  options: { label: string; value: string }[],
  displayShowAll: boolean = false
): FilterGroupType => ({
  key,
  label: i18next.t(`${BASE_I18N}.${key}.label`),
  description: i18next.t(`${BASE_I18N}.${key}.description`),
  tagLabel: i18next.t(`${BASE_I18N}.${key}.tagLabel`),
  options,
  displayShowAll
});

const formatOptionsFromConfig = (obj: Record<string, string>) =>
  Object.entries(obj).map(([value, label]) => ({
    label,
    value
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
    // convert category name like 'Model closeout or extension' to 'MODEL_CLOSEOUT_OR_EXTENSION' for query param
    value: name.replaceAll(' ', '_').toUpperCase()
  }));

  const facilitatedByOptions = formatOptionsFromConfig(
    tObject<MtoFacilitator>('mtoMilestone:facilitatedBy.options')
  );

  const statusOptions = formatOptionsFromConfig(
    tObject<string>('mtoMilestone:status.options')
  );

  const riskIndicatorOptions = formatOptionsFromConfig(
    tObject<string>('mtoMilestone:riskIndicator.options')
  );

  const otherFilterOptions = formatOptionsFromConfig(
    tObject<string>(`${BASE_I18N}.other.options`)
  );

  return [
    buildFilterGroup('category', categoryOptions, true),
    buildFilterGroup('role', facilitatedByOptions),
    buildFilterGroup('status', statusOptions),
    buildFilterGroup('risk', riskIndicatorOptions),
    buildFilterGroup('other', otherFilterOptions)
  ];
};

export default getMTOTableFilters;
