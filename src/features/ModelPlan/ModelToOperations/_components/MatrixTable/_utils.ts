import { DATE_FILTER_PARAM } from 'features/ModelPlan/ModelToOperations/_components/MTOTableFilters';
import type { GetModelToOperationsMatrixQuery } from 'gql/generated/graphql';

import { isNeededWithinDays } from 'utils/date';

import type { CategoryType, MilestoneType, SubCategoryType } from './columns';

/**
 * Type for the MTO matrix categories array from the GetModelToOperationsMatrix query.
 */
export type GetModelToOperationsMatrixCategoryType =
  GetModelToOperationsMatrixQuery['modelPlan']['mtoMatrix']['categories'];

/**
 * Counts category header rows in the MTO matrix (one per category and one per subcategory).
 *
 * Excludes uncategorized categories with no milestones.
 */
export const countMtoCategoryHeaderRows = (
  categories: GetModelToOperationsMatrixCategoryType | null | undefined
): number => {
  if (!categories?.length) {
    return 0;
  }
  return categories.reduce((total, category) => {
    const categoryMilestones =
      category.subCategories?.reduce(
        (acc, subCategory) => acc + (subCategory.milestones?.length ?? 0),
        0
      ) ?? 0;

    if (category.name === 'Uncategorized' && categoryMilestones === 0) {
      return total;
    }

    return total + 1 + (category.subCategories?.length ?? 0);
  }, 0);
};

export type NeededWithinWindowDays = 30 | 60 | 90;

export const parseNeededWithinDaysFromSearchParams = (
  params: URLSearchParams
): NeededWithinWindowDays | null => {
  const raw = params.get(DATE_FILTER_PARAM); // needed-by-date-range=NEXT_30_DAYS

  const dateRange = raw?.split('_')[1];

  if (dateRange === '30' || dateRange === '60' || dateRange === '90') {
    return Number(dateRange) as NeededWithinWindowDays;
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
 * containing all milestones. Used when category/subcategory rows are hidden
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
