import i18next from 'i18next';
import { lowerCase } from 'lodash';

import { MilestoneCardType } from '..';

export type MilestoneFilterFields = Pick<
  MilestoneCardType,
  'categoryName' | 'facilitatedByRole'
>;

/** Base type for milestone filter groups */
export type MilestoneFilterObject = {
  key: keyof MilestoneFilterFields;
  label: string;
  fieldLabel: string;
  options: {
    label: string;
    value: any;
  }[];
  /** Whether to display the "show all" checkbox option */
  displayShowAll?: boolean;
}[];

/**
 * Returns the `categoryName` and `facilitatedByRole` milestone filters for use in the `FilterModal` component
 */
const getMilestoneFilters = (
  /** Milestones currently being displayed after applying any other filters or search criteria */
  milestones: MilestoneCardType[]
) => {
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
        'helpAndKnowledge:milestoneLibrary.filters.primaryCategory'
      ),
      fieldLabel: i18next.t(
        'helpAndKnowledge:milestoneLibrary.filters.category'
      ),
      options: uniqueCategoryNames.map(categoryName => ({
        label: categoryName,
        value: categoryName
      })),
      displayShowAll: true
    },
    {
      key: 'facilitatedByRole',
      label: lowerCase(
        i18next.t('helpAndKnowledge:milestoneLibrary.filters.facilitatedByRole')
      ),
      fieldLabel: i18next.t(
        'helpAndKnowledge:milestoneLibrary.filters.facilitatedByRole'
      ),
      options: uniqueFacilitatedByRoles.map(facilitatedByRole => ({
        label: i18next.t(
          `mtoMilestone:facilitatedBy.options.${facilitatedByRole}`
        ),
        value: facilitatedByRole
      }))
    }
  ] as const satisfies MilestoneFilterObject;
};

export type MilestoneFilters = ReturnType<typeof getMilestoneFilters>;
export type MilestoneFilter = MilestoneFilters[number];

export default getMilestoneFilters;
