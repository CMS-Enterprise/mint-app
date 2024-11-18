import {
  GetModelToOperationsMatrixQuery,
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator
} from 'gql/generated/graphql';

import { CategoryType } from './columns';
import {
  formatAndHomogenizeMilestoneData,
  getRenderedRowIndexes,
  moveRow
} from '.';

type QueryType =
  GetModelToOperationsMatrixQuery['modelPlan']['mtoMatrix']['categories'];

describe('formatAndHomogenizeMilestoneData', () => {
  it('should format and homogenize milestone data correctly', () => {
    const mockData: QueryType = [
      {
        __typename: 'MTOCategory',
        id: '123',
        name: 'Milestone 1',
        subCategories: [
          {
            __typename: 'MTOSubcategory',
            id: '456',
            name: 'Subcategory 1',
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: '789',
                riskIndicator: MtoRiskIndicator.AT_RISK,
                name: 'Milestone 1',
                // solutions: [],
                facilitatedBy: MtoFacilitator.APPLICATION_SUPPORT_CONTRACTOR,
                needBy: '2022-01-01',
                status: MtoMilestoneStatus.IN_PROGRESS
              }
            ],
            isUncategorized: false
          }
        ],
        isUncategorized: false
      }
    ];

    const expectedOutput: CategoryType[] = [
      {
        __typename: 'MTOCategory',
        id: '123',
        riskIndicator: undefined,
        name: 'Milestone 1',
        facilitatedBy: undefined,
        solutions: [],
        needBy: undefined,
        status: undefined,
        actions: undefined,
        subCategories: [
          {
            __typename: 'MTOSubcategory',
            id: '456',
            riskIndicator: undefined,
            name: 'Subcategory 1',
            facilitatedBy: undefined,
            solutions: [],
            needBy: undefined,
            status: undefined,
            actions: undefined,
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: '789',
                riskIndicator: MtoRiskIndicator.AT_RISK,
                name: 'Milestone 1',
                facilitatedBy: MtoFacilitator.APPLICATION_SUPPORT_CONTRACTOR,
                solutions: [],
                needBy: '2022-01-01',
                status: MtoMilestoneStatus.IN_PROGRESS,
                actions: undefined
              }
            ],
            isUncategorized: false
          }
        ],
        isUncategorized: false
      }
    ];

    const result = formatAndHomogenizeMilestoneData(mockData);
    expect(result).toEqual(expectedOutput);
  });
});

describe('moveRow', () => {
  let mockData: CategoryType[];

  beforeEach(() => {
    mockData = [
      {
        __typename: 'MTOCategory',
        id: '123',
        riskIndicator: undefined,
        name: 'Milestone 1',
        facilitatedBy: undefined,
        solutions: [],
        needBy: undefined,
        status: undefined,
        actions: undefined,
        subCategories: [
          {
            __typename: 'MTOSubcategory',
            id: '456',
            riskIndicator: undefined,
            name: 'Subcategory 1',
            facilitatedBy: undefined,
            solutions: [],
            needBy: undefined,
            status: undefined,
            actions: undefined,
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: '789',
                riskIndicator: MtoRiskIndicator.AT_RISK,
                name: 'Milestone 1',
                facilitatedBy: MtoFacilitator.APPLICATION_SUPPORT_CONTRACTOR,
                solutions: [],
                needBy: '2022-01-01',
                status: MtoMilestoneStatus.IN_PROGRESS,
                actions: undefined
              }
            ],
            isUncategorized: false
          },
          {
            __typename: 'MTOSubcategory',
            id: '4562',
            riskIndicator: undefined,
            name: 'Subcategory 2',
            facilitatedBy: undefined,
            solutions: [],
            needBy: undefined,
            status: undefined,
            actions: undefined,
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: '7892',
                riskIndicator: MtoRiskIndicator.AT_RISK,
                name: 'Milestone 2',
                facilitatedBy: MtoFacilitator.APPLICATION_SUPPORT_CONTRACTOR,
                solutions: [],
                needBy: '2022-01-01',
                status: MtoMilestoneStatus.IN_PROGRESS,
                actions: undefined
              }
            ],
            isUncategorized: false
          }
        ],
        isUncategorized: false
      },
      {
        __typename: 'MTOCategory',
        id: '1232',
        riskIndicator: undefined,
        name: 'Category 2',
        facilitatedBy: undefined,
        solutions: [],
        needBy: undefined,
        status: undefined,
        actions: undefined,
        subCategories: []
      }
    ];
  });

  it('should move a category', () => {
    const result = moveRow([0], [1], 'category', mockData);
    expect(result).toEqual([
      {
        __typename: 'MTOCategory',
        id: '1232',
        riskIndicator: undefined,
        name: 'Category 2',
        facilitatedBy: undefined,
        solutions: [],
        needBy: undefined,
        status: undefined,
        actions: undefined,
        subCategories: []
      },
      {
        __typename: 'MTOCategory',
        id: '123',
        riskIndicator: undefined,
        name: 'Milestone 1',
        facilitatedBy: undefined,
        solutions: [],
        needBy: undefined,
        status: undefined,
        actions: undefined,
        subCategories: [
          {
            __typename: 'MTOSubcategory',
            id: '456',
            riskIndicator: undefined,
            name: 'Subcategory 1',
            facilitatedBy: undefined,
            solutions: [],
            needBy: undefined,
            status: undefined,
            actions: undefined,
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: '789',
                riskIndicator: MtoRiskIndicator.AT_RISK,
                name: 'Milestone 1',
                facilitatedBy: MtoFacilitator.APPLICATION_SUPPORT_CONTRACTOR,
                solutions: [],
                needBy: '2022-01-01',
                status: MtoMilestoneStatus.IN_PROGRESS,
                actions: undefined
              }
            ],
            isUncategorized: false
          },
          {
            __typename: 'MTOSubcategory',
            id: '4562',
            riskIndicator: undefined,
            name: 'Subcategory 2',
            facilitatedBy: undefined,
            solutions: [],
            needBy: undefined,
            status: undefined,
            actions: undefined,
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: '7892',
                riskIndicator: MtoRiskIndicator.AT_RISK,
                name: 'Milestone 2',
                facilitatedBy: MtoFacilitator.APPLICATION_SUPPORT_CONTRACTOR,
                solutions: [],
                needBy: '2022-01-01',
                status: MtoMilestoneStatus.IN_PROGRESS,
                actions: undefined
              }
            ],
            isUncategorized: false
          }
        ],
        isUncategorized: false
      }
    ]);
  });

  it('should move a subcategory', () => {
    const result = moveRow([0, 0], [0, 1], 'subcategory', mockData);
    expect(result).toEqual([
      {
        __typename: 'MTOCategory',
        id: '123',
        riskIndicator: undefined,
        name: 'Milestone 1',
        facilitatedBy: undefined,
        solutions: [],
        needBy: undefined,
        status: undefined,
        actions: undefined,
        subCategories: [
          {
            __typename: 'MTOSubcategory',
            id: '4562',
            riskIndicator: undefined,
            name: 'Subcategory 2',
            facilitatedBy: undefined,
            solutions: [],
            needBy: undefined,
            status: undefined,
            actions: undefined,
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: '7892',
                riskIndicator: MtoRiskIndicator.AT_RISK,
                name: 'Milestone 2',
                facilitatedBy: MtoFacilitator.APPLICATION_SUPPORT_CONTRACTOR,
                solutions: [],
                needBy: '2022-01-01',
                status: MtoMilestoneStatus.IN_PROGRESS,
                actions: undefined
              }
            ],
            isUncategorized: false
          },
          {
            __typename: 'MTOSubcategory',
            id: '456',
            riskIndicator: undefined,
            name: 'Subcategory 1',
            facilitatedBy: undefined,
            solutions: [],
            needBy: undefined,
            status: undefined,
            actions: undefined,
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: '789',
                riskIndicator: MtoRiskIndicator.AT_RISK,
                name: 'Milestone 1',
                facilitatedBy: MtoFacilitator.APPLICATION_SUPPORT_CONTRACTOR,
                solutions: [],
                needBy: '2022-01-01',
                status: MtoMilestoneStatus.IN_PROGRESS,
                actions: undefined
              }
            ],
            isUncategorized: false
          }
        ],
        isUncategorized: false
      },
      {
        __typename: 'MTOCategory',
        id: '1232',
        riskIndicator: undefined,
        name: 'Category 2',
        facilitatedBy: undefined,
        solutions: [],
        needBy: undefined,
        status: undefined,
        actions: undefined,
        subCategories: []
      }
    ]);
  });
});

describe('getRenderedRowIndexes', () => {
  it('should return the correct rendered row indexes for a given page', () => {
    const rows: CategoryType[] = [
      {
        __typename: 'MTOCategory',
        id: '123',
        riskIndicator: undefined,
        name: 'Milestone 1',
        facilitatedBy: undefined,
        solutions: [],
        needBy: undefined,
        status: undefined,
        actions: undefined,
        subCategories: [
          {
            __typename: 'MTOSubcategory',
            id: '456',
            riskIndicator: undefined,
            name: 'Subcategory 1',
            facilitatedBy: undefined,
            solutions: [],
            needBy: undefined,
            status: undefined,
            actions: undefined,
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: '789',
                riskIndicator: MtoRiskIndicator.AT_RISK,
                name: 'Milestone 1',
                facilitatedBy: MtoFacilitator.APPLICATION_SUPPORT_CONTRACTOR,
                solutions: [],
                needBy: '2022-01-01',
                status: MtoMilestoneStatus.IN_PROGRESS,
                actions: undefined
              },
              {
                __typename: 'MTOMilestone',
                id: '7893',
                riskIndicator: MtoRiskIndicator.AT_RISK,
                name: 'Milestone 3',
                facilitatedBy: MtoFacilitator.APPLICATION_SUPPORT_CONTRACTOR,
                solutions: [],
                needBy: '2022-01-01',
                status: MtoMilestoneStatus.IN_PROGRESS,
                actions: undefined
              }
            ],
            isUncategorized: false
          },
          {
            __typename: 'MTOSubcategory',
            id: '4562',
            riskIndicator: undefined,
            name: 'Subcategory 2',
            facilitatedBy: undefined,
            solutions: [],
            needBy: undefined,
            status: undefined,
            actions: undefined,
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: '7892',
                riskIndicator: MtoRiskIndicator.AT_RISK,
                name: 'Milestone 2',
                facilitatedBy: MtoFacilitator.APPLICATION_SUPPORT_CONTRACTOR,
                solutions: [],
                needBy: '2022-01-01',
                status: MtoMilestoneStatus.IN_PROGRESS,
                actions: undefined
              }
            ],
            isUncategorized: false
          }
        ],
        isUncategorized: false
      },
      {
        __typename: 'MTOCategory',
        id: '1232',
        riskIndicator: undefined,
        name: 'Category 2',
        facilitatedBy: undefined,
        solutions: [],
        needBy: undefined,
        status: undefined,
        actions: undefined,
        subCategories: []
      }
    ];
    const rowsPerPage = 2;
    const currentPage = 1;

    const expectedOutput = {
      category: [0],
      subCategory: [[1], []],
      milestone: [[[], [0]], []]
    };

    const result = getRenderedRowIndexes(rows, rowsPerPage, currentPage);
    expect(result).toEqual(expectedOutput);
  });
});
