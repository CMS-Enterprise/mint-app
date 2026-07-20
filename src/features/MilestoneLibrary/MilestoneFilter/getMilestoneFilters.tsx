import { MilestoneCardType } from 'features/MilestoneLibrary/MilestoneCardGroup';
import i18next from 'i18next';
import { upperFirst } from 'lodash';

import { FilterGroupType } from 'components/FilterGroup';

/**
 * Returns the `categoryName` and `facilitatedByRole` milestone filters for use in the `FilterModal` component
 */
const getMilestoneFilters = (
  /** Milestones currently being displayed after applying any other filters or search criteria */
  milestones: MilestoneCardType[]
): FilterGroupType[] => {
  // Extract unique values for each field
  const categoryNames = milestones.map(milestone => milestone.categoryName);
  const uniqueCategoryNames = [...new Set(categoryNames)];

  const facilitatedByRoles = milestones.map(
    milestone => milestone.facilitatedByRole
  );
  const uniqueFacilitatedByRoles = [...new Set(facilitatedByRoles.flat())];

  return [
    {
      key: 'categoryName',
      label: i18next.t(
        'helpAndKnowledge:milestoneLibrary.filters.primaryCategory.heading'
      ),
      description: i18next.t(
        'helpAndKnowledge:milestoneLibrary.filters.primaryCategory.description'
      ),
      tagLabel: i18next.t(
        'helpAndKnowledge:milestoneLibrary.filters.primaryCategory.tagLabel'
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
        'helpAndKnowledge:milestoneLibrary.filters.facilitatedByRole.heading'
      ),
      description: i18next.t(
        'helpAndKnowledge:milestoneLibrary.filters.facilitatedByRole.description'
      ),
      tagLabel: upperFirst(
        i18next.t(
          'helpAndKnowledge:milestoneLibrary.filters.facilitatedByRole.tagLabel'
        )
      ),
      options: uniqueFacilitatedByRoles.map(facilitatedByRole => ({
        label: i18next.t(
          `mtoMilestone:facilitatedBy.options.${facilitatedByRole}`
        ),
        value: facilitatedByRole
      })),
      displayShowAll: false
    }
  ];
};

export default getMilestoneFilters;
