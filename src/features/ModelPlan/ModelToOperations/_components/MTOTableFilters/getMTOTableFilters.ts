import { GetMtoCategoriesQuery, MtoFacilitator } from 'gql/generated/graphql';
import i18next from 'i18next';

import { FilterGroupType } from 'components/FilterGroup';
import { tObject } from 'utils/translation';

type Category =
  GetMtoCategoriesQuery['modelPlan']['mtoMatrix']['categories'][0];

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

  const facilitatedByOptions = tObject<MtoFacilitator>(
    'mtoMilestone:facilitatedBy.options'
  );

  return [
    {
      key: 'categoryName',
      label: i18next.t(
        'modelToOperationsMisc:table.tableFilters.filterOptions.primaryCategory.label'
      ),
      description: i18next.t(
        'modelToOperationsMisc:table.tableFilters.filterOptions.primaryCategory.description'
      ),
      tagLabel: i18next.t(
        'modelToOperationsMisc:table.tableFilters.filterOptions.primaryCategory.tagLabel'
      ),
      options: uniqueCategoryNames.map(categoryName => ({
        label: categoryName,
        value: categoryName
      })),
      displayShowAll: true
    },
    {
      key: 'facilitatedByRole',
      label: i18next.t(
        'modelToOperationsMisc:table.tableFilters.filterOptions.facilitatedByRole.label'
      ),
      description: i18next.t(
        'modelToOperationsMisc:table.tableFilters.filterOptions.facilitatedByRole.description'
      ),
      tagLabel: i18next.t(
        'modelToOperationsMisc:table.tableFilters.filterOptions.facilitatedByRole.tagLabel'
      ),
      options: Object.keys(facilitatedByOptions).map(facilitatedByRole => ({
        label: i18next.t(
          `mtoMilestone:facilitatedBy.options.${facilitatedByRole}`
        ),
        value: facilitatedByRole
      })),
      displayShowAll: false
    }
  ];
};

export default getMTOTableFilters;
