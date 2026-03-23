import type { GetModelToOperationsMatrixQuery } from 'gql/generated/graphql';

import { isNeededWithinDays } from 'utils/date';

import type {
  CategoryType,
  MilestoneType,
  SubCategoryType
} from '../_components/MatrixTable/columns';

/**
 * Type for the MTO matrix categories array from the GetModelToOperationsMatrix query.
 */
export type GetModelToOperationsMatrixCategoryType =
  GetModelToOperationsMatrixQuery['modelPlan']['mtoMatrix']['categories'];

export type NeededWithinWindowDays = 30 | 60 | 90;

export const parseNeededWithinDaysFromSearchParams = (
  params: URLSearchParams
): NeededWithinWindowDays | null => {
  if (params.get('needed-within-thirty-days') === 'true') {
    return 30;
  }
  const raw = params.get('needed-within-days');
  if (raw === '30' || raw === '60' || raw === '90') {
    return Number(raw) as NeededWithinWindowDays;
  }
  return null;
};

/**
 * Filters the category tree to only include milestones whose needBy date
 * is within the next `days` calendar days (UTC). Drops empty subcategories and categories.
 */
export const filterMilestonesNeededWithinDays = (
  categoryData: CategoryType[],
  days: NeededWithinWindowDays
): CategoryType[] => {
  const categoriesWithFilteredSubcategories = categoryData.map(category => {
    const subCategoriesWithFilteredMilestones = category.subCategories.map(
      subCategory => ({
        ...subCategory,
        milestones: subCategory.milestones.filter(milestone =>
          isNeededWithinDays(milestone.needBy, days)
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
 * containing all milestones. Used when a "needed within N days" filter is on
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
