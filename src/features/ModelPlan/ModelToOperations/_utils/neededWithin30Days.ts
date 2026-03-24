import type { GetModelToOperationsMatrixQuery } from 'gql/generated/graphql';

import { isNeededWithin30Days } from 'utils/date';

import type {
  CategoryType,
  MilestoneType,
  SubCategoryType
} from '../_components/MatrixTable/columns';

/**
 * Type for the MTO matrix categories array from the GetModelToOperationsMatrix query.
 * Used for counting milestones needed within 30 days without depending on formatted table data.
 */
export type GetModelToOperationsMatrixCategoryType =
  GetModelToOperationsMatrixQuery['modelPlan']['mtoMatrix']['categories'];

/**
 * Returns the number of milestones whose needBy date is within the next 30 days (UTC).
 */
export const getMilestonesNeededWithin30DaysCount = (
  categoryData: GetModelToOperationsMatrixCategoryType
): number => {
  let count = 0;
  categoryData.forEach(category => {
    category.subCategories?.forEach(subCategory => {
      subCategory.milestones?.forEach(milestone => {
        if (isNeededWithin30Days(milestone.needBy ?? null)) count += 1;
      });
    });
  });
  return count;
};

/**
 * Filters the category tree to only include milestones whose needBy date
 * is within the next 30 days (UTC). Drops empty subcategories and categories.
 */
export const filterMilestonesNeededWithin30Days = (
  categoryData: CategoryType[]
): CategoryType[] => {
  const categoriesWithFilteredSubcategories = categoryData.map(category => {
    const subCategoriesWithFilteredMilestones = category.subCategories.map(
      subCategory => ({
        ...subCategory,
        milestones: subCategory.milestones.filter(milestone =>
          isNeededWithin30Days(milestone.needBy)
        )
      })
    );

    const filteredSubCategoriesWithMilestones =
      subCategoriesWithFilteredMilestones.filter(
        subCategory => subCategory.milestones.length > 0
      );

    return {
      ...category,
      subCategories: filteredSubCategoriesWithMilestones
    };
  });

  return categoriesWithFilteredSubcategories.filter(
    category => category.subCategories.length > 0
  );
};

/**
 * Flattens the category tree into a single category with a single subcategory
 * containing all milestones. Used when "needed within 30 days" filter is on
 * so that sorting applies across all visible milestones, not per group.
 */
export const flattenToSingleCategory = (
  categoryData: CategoryType[]
): CategoryType[] => {
  const allMilestones: MilestoneType[] = [];
  categoryData.forEach(category => {
    category.subCategories.forEach(subCategory => {
      allMilestones.push(...subCategory.milestones);
    });
  });

  if (allMilestones.length === 0) {
    return [];
  }

  const singleSubCategory: SubCategoryType = {
    __typename: 'MTOSubcategory',
    id: 'filtered-milestones',
    riskIndicator: undefined,
    name: '',
    facilitatedBy: undefined,
    solutions: [],
    needBy: undefined,
    status: undefined,
    actions: undefined,
    milestones: allMilestones,
    isUncategorized: false
  };

  const singleCategory: CategoryType = {
    __typename: 'MTOCategory',
    id: 'filtered-milestones',
    riskIndicator: undefined,
    name: '',
    facilitatedBy: undefined,
    solutions: [],
    needBy: undefined,
    status: undefined,
    actions: undefined,
    subCategories: [singleSubCategory],
    isUncategorized: false
  };

  return [singleCategory];
};
