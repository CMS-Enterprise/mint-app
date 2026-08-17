import { MTOTableSelectedFilters } from 'features/ModelPlan/ModelToOperations/_components/MTOTableFilters';
import type { GetModelToOperationsMatrixQuery } from 'gql/generated/graphql';

import { isDateWithinRange, isNeededWithinDays } from 'utils/date';

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

const isMilestoneNeededWithinRange = (
  milestoneDate: string,
  filterRange: string[]
) => {
  if (!milestoneDate) {
    return false;
  }

  // Handle preset ranges like NEXT_30_DAYS, NEXT_60_DAYS, NEXT_90_DAYS
  if (filterRange.length === 1) {
    const neededWithinDays = filterRange[0].split('_')[1];
    return isNeededWithinDays(milestoneDate, Number(neededWithinDays));
  }
  // Handle custom filter range : ['2024-06-01','2024-06-30']
  if (filterRange.length === 2) {
    const [startDate, endDate] = filterRange;
    return isDateWithinRange(milestoneDate, startDate, endDate);
  }

  return false;
};

// Filter milestones base on applied filters, remove subcategories that have no milestones after filtering
export const filterMilestones = (
  filters: MTOTableSelectedFilters,
  categoryData: CategoryType[]
): CategoryType[] => {
  const filteredCategories = categoryData.map(category => {
    const categoryWithFilteredMilestones = category.subCategories.map(
      subCategory => {
        // Filter Milestones against all applied rules
        const filteredMilestones = subCategory.milestones.filter(milestone => {
          const isStatusMatch =
            filters.status.length > 0 &&
            filters.status.includes(milestone.status);

          const isRiskMatch =
            filters.risk.length > 0 &&
            filters.risk.includes(milestone.riskIndicator);

          const isRoleMatch =
            filters.role.length > 0 &&
            milestone.facilitatedBy?.some(role => filters.role.includes(role));

          const isCategoryMatch =
            filters.category.length > 0 &&
            filters.category.some(
              filterCat =>
                filterCat.toLowerCase() === category.name?.toLowerCase()
            );

          const isDateMatch =
            filters.neededByDateRange.length > 0 &&
            isMilestoneNeededWithinRange(
              milestone.needBy ?? '',
              filters.neededByDateRange
            );

          // Other Filter Match

          // Return true if the milestone matches ANY active filter group
          return (
            isStatusMatch ||
            isRiskMatch ||
            isRoleMatch ||
            isCategoryMatch ||
            isDateMatch
          );
        });

        return {
          ...subCategory,
          milestones: filteredMilestones
        };
      }
    );

    const subCategoriesWithMilestones = categoryWithFilteredMilestones.filter(
      subCategory => subCategory.milestones.length > 0
    );

    return {
      ...category,
      subCategories: subCategoriesWithMilestones
    };
  });

  return filteredCategories.filter(
    category => category.subCategories.length > 0
  );
};
