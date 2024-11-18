import {
  GetModelToOperationsMatrixQuery,
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator
} from 'gql/generated/graphql';

import { CategoryType } from './columns';
import { formatAndHomogenizeMilestoneData } from '.';

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

  //   it('format query data to mimic milestone type', () => {
  //     const mockData = [
  //       {
  //         id: '1',
  //         name: 'Milestone 1'
  //         // Missing date and status
  //       }
  //     ];

  //     const expectedOutput = [
  //       {
  //         id: '1',
  //         name: 'Milestone 1',
  //         date: undefined,
  //         status: undefined,
  //         formattedDate: undefined // Assuming the function handles missing fields
  //       }
  //     ];

  //     const result = formatAndHomogenizeMilestoneData(mockData);
  //     expect(result).toEqual(expectedOutput);
  //   });
});
