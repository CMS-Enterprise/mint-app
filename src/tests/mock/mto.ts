import { MockedResponse } from '@apollo/client/testing';
import {
  GetMilestoneSuggestedAnswerDocument,
  GetModelToOperationsMatrixDocument,
  GetMtoAllMilestonesDocument,
  GetMtoAllMilestonesQuery,
  GetMtoAllMilestonesQueryVariables,
  GetMtoAllSolutionsDocument,
  GetMtoCategoriesDocument,
  GetMtoCommonSolutionsDocument,
  GetMtoMilestoneDocument,
  GetMtoMilestonesDocument,
  GetMtoSolutionDocument,
  GetMtoSolutionQuery,
  GetMtoSolutionQueryVariables,
  GetMtoSolutionsAndMilestonesDocument,
  GetPossibleSolutionsDocument,
  MtoCommonMilestoneKey,
  MtoCommonSolutionKey,
  MtoCommonSolutionSubject,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  MtoSolutionStatus,
  MtoSolutionType,
  MtoStatus,
  OperationalSolutionKey
} from 'gql/generated/graphql';

export const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

export const mtoMatrixMock = [
  {
    request: {
      query: GetModelToOperationsMatrixDocument,
      variables: {
        id: modelID
      }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          mtoMatrix: {
            __typename: 'ModelsToOperationMatrix',
            status: MtoStatus.IN_PROGRESS,
            categories: [],
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: '123',
                key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
                name: 'Milestone 1'
              }
            ],

            commonMilestones: [],
            recentEdit: null
          }
        }
      }
    }
  }
];

export const commonMilestonesMock = [
  {
    request: {
      query: GetMtoMilestonesDocument,
      variables: {
        id: modelID
      }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          mtoMatrix: {
            __typename: 'ModelsToOperationMatrix',
            commonMilestones: [
              {
                __typename: 'MTOCommonMilestone',
                name: 'Test Milestone',
                key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
                isAdded: false,
                isSuggested: true,
                categoryName: 'Test Category',
                subCategoryName: 'Test SubCategory',
                facilitatedByRole: [],
                commonSolutions: [
                  {
                    key: MtoCommonSolutionKey.BCDA
                  }
                ]
              }
            ]
          }
        }
      }
    }
  }
];

export const commonSolutionsMock = [
  {
    request: {
      query: GetMtoCommonSolutionsDocument,
      variables: {
        id: modelID
      }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          mtoMatrix: {
            __typename: 'ModelsToOperationMatrix',
            commonSolutions: [
              {
                __typename: 'MTOCommonSolution',
                name: 'common solution 1',
                isAdded: false,
                key: MtoCommonSolutionKey.ACO_OS,
                type: MtoSolutionType.CONTRACTOR,
                subjects: [
                  MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS
                ]
              },
              {
                __typename: 'MTOCommonSolution',
                name: 'common solution 2',
                isAdded: false,
                key: MtoCommonSolutionKey.APPS,
                type: MtoSolutionType.CROSS_CUTTING_GROUP,
                subjects: [
                  MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS
                ]
              }
            ]
          }
        }
      }
    }
  }
];

export const possibleSolutionsMock = [
  {
    request: {
      query: GetPossibleSolutionsDocument
    },
    results: {
      data: {
        possibleOperationalSolutions: [
          {
            id: '123',
            key: OperationalSolutionKey.ACO_OS,
            pointsOfContact: [
              {
                __typename: 'PossibleOperationalSolutionContact',
                id: '123',
                name: 'test',
                email: 'email@email.com',
                isTeam: true,
                isPrimary: true,
                role: 'role'
              }
            ]
          }
        ]
      }
    }
  }
];

export const allMTOSolutionsMock = [
  {
    request: {
      query: GetMtoAllSolutionsDocument,
      variables: {
        id: modelID
      }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          mtoMatrix: {
            __typename: 'ModelsToOperationMatrix',
            commonSolutions: [
              {
                __typename: 'MTOCommonSolution',
                key: MtoCommonSolutionKey.BCDA,
                name: 'common solution 1'
              },
              {
                __typename: 'MTOCommonSolution',
                key: MtoCommonSolutionKey.BCDA,
                name: 'common solution 2'
              }
            ],
            solutions: [
              {
                __typename: 'MtoSolution',
                id: '1',
                name: 'Solution 1',
                key: MtoCommonSolutionKey.BCDA
              }
            ]
          }
        }
      }
    }
  }
];

export const milestoneMock = (id: string) => [
  {
    request: {
      query: GetMtoMilestoneDocument,
      variables: {
        id
      }
    },
    result: {
      data: {
        mtoMilestone: {
          __typename: 'MtoMilestone',
          id: '123',
          name: 'Milestone 1',
          key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
          facilitatedBy: [],
          needBy: '2021-08-01',
          status: MtoMilestoneStatus.COMPLETED,
          riskIndicator: MtoRiskIndicator.AT_RISK,
          addedFromMilestoneLibrary: true,
          isDraft: false,
          categories: {
            category: {
              __typename: 'MtoCategory',
              id: '1'
            },
            subCategory: {
              __typename: 'MtoSubcategory',
              id: '2'
            }
          },
          commonMilestone: {
            __typename: 'MTOCommonMilestone',
            key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
            commonSolutions: [
              {
                __typename: 'MTOCommonSolution',
                key: MtoCommonSolutionKey.BCDA
              }
            ]
          },
          solutions: [
            {
              __typename: 'MtoSolution',
              id: '1',
              name: 'Solution 1',
              key: MtoCommonSolutionKey.BCDA,
              status: MtoMilestoneStatus.COMPLETED,
              riskIndicator: MtoRiskIndicator.AT_RISK,
              commonSolution: [
                {
                  __typename: 'MtoCommonSolution',
                  name: 'common solution 1',
                  key: MtoCommonSolutionKey.BCDA,
                  isAdded: true
                }
              ]
            }
          ]
        }
      }
    }
  }
];

export const allMilestonesMock: MockedResponse<
  GetMtoAllMilestonesQuery,
  GetMtoAllMilestonesQueryVariables
> = {
  request: {
    query: GetMtoAllMilestonesDocument,
    variables: {
      id: modelID
    }
  },
  result: {
    data: {
      __typename: 'Query',
      modelPlan: {
        __typename: 'ModelPlan',
        id: modelID,
        mtoMatrix: {
          __typename: 'ModelsToOperationMatrix',
          commonMilestones: [],
          milestones: [
            {
              __typename: 'MTOMilestone',
              id: '123',
              key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
              name: 'Milestone 1',
              status: MtoMilestoneStatus.COMPLETED,
              riskIndicator: MtoRiskIndicator.AT_RISK,
              solutions: []
            }
          ]
        }
      }
    }
  }
};

export const solutionMock = (
  id: string = '1',
  addedFromSolutionLibrary: boolean = true
): MockedResponse<GetMtoSolutionQuery, GetMtoSolutionQueryVariables> => {
  return {
    request: {
      query: GetMtoSolutionDocument,
      variables: {
        id
      }
    },
    result: {
      data: {
        __typename: 'Query',
        mtoSolution: {
          __typename: 'MTOSolution',
          id,
          name: 'Solution 1',
          key: addedFromSolutionLibrary ? MtoCommonSolutionKey.BCDA : null,
          status: MtoSolutionStatus.COMPLETED,
          riskIndicator: MtoRiskIndicator.AT_RISK,
          addedFromSolutionLibrary,
          facilitatedBy: null,
          type: MtoSolutionType.IT_SYSTEM,
          neededBy: '2121-08-01',
          pocName: 'Test Name',
          pocEmail: 'jon@oddball.io',
          milestones: [
            {
              __typename: 'MTOMilestone',
              id: '123',
              key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
              name: 'Milestone 1',
              status: MtoMilestoneStatus.COMPLETED,
              riskIndicator: MtoRiskIndicator.AT_RISK,
              commonMilestone: {
                __typename: 'MTOCommonMilestone',
                name: 'Common Milestone 1',
                key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
                isAdded: true
              }
            }
          ]
        }
      }
    }
  };
};

export const categoryMock = [
  {
    request: {
      query: GetMtoCategoriesDocument,
      variables: {
        id: modelID
      }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          mtoMatrix: {
            __typename: 'MtoMatrix',
            categories: [
              {
                __typename: 'MtoCategory',
                id: '123',
                name: 'Category 1',
                subCategories: {
                  __typename: 'MtoSubCategory',
                  id: '123',
                  name: 'SubCategory 1'
                }
              },
              {
                __typename: 'MtoCategory',
                id: '456',
                name: 'Category 2',
                subCategories: {
                  __typename: 'MtoSubCategory',
                  id: '123',
                  name: 'SubCategory 2'
                }
              }
            ]
          }
        }
      }
    }
  }
];

export const suggestedMilestonesMock = [
  {
    request: {
      query: GetMilestoneSuggestedAnswerDocument,
      skip: false,
      variables: {
        id: modelID,
        generalCharacteristics: false,
        participantsAndProviders: false,
        beneficiaries: false,
        opsEvalAndLearning: true,
        payments: false,
        managePartCDEnrollment: false,
        collectPlanBids: false,
        planContractUpdated: false,
        agreementTypes: false,
        recruitmentMethod: false,
        selectionMethod: false,
        communicationMethod: false,
        providerOverlap: false,
        participantsIds: false,
        beneficiaryOverlap: false,
        helpdeskUse: false,
        iddocSupport: false,
        benchmarkForPerformance: false,
        appealPerformance: false,
        appealFeedback: false,
        appealPayments: false,
        appealOther: false,
        evaluationApproaches: true,
        dataNeededForMonitoring: false,
        dataToSendParticicipants: false,
        modelLearningSystems: false,
        developNewQualityMeasures: false,
        payType: false,
        shouldAnyProvidersExcludedFFSSystems: false,
        nonClaimsPayments: false,
        willRecoverPayments: false
      }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          opsEvalAndLearning: {
            __typename: 'PlanOpsEvalAndLearning',
            evaluationApproaches: ['CONTROL_INTERVENTION', 'COMPARISON_MATCH']
          }
        }
      }
    }
  }
];

export const solutionAndMilestoneMock = [
  {
    request: {
      query: GetMtoSolutionsAndMilestonesDocument,
      variables: {
        id: modelID
      }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlan: {
          __typename: 'ModelPlan',
          id: '123',
          mtoMatrix: {
            __typename: 'ModelsToOperationMatrix',
            solutions: [
              {
                __typename: 'MTOSolution',
                id: '1',
                key: MtoCommonSolutionKey.ACO_OS,
                name: 'Solution 1',
                riskIndicator: MtoRiskIndicator.AT_RISK,
                type: MtoSolutionType.IT_SYSTEM,
                status: MtoSolutionStatus.IN_PROGRESS,
                addedFromSolutionLibrary: true,
                facilitatedBy: [],
                neededBy: '',
                milestones: [
                  {
                    __typename: 'MTOMilestone',
                    id: '1',
                    name: 'Milestone 1'
                  }
                ]
              }
            ],
            milestonesWithNoLinkedSolutions: [
              {
                __typename: 'MTOMilestone',
                id: '1',
                name: 'Milestone 1'
              }
            ]
          }
        }
      }
    }
  }
];

const allMocks = [
  ...suggestedMilestonesMock,
  ...commonMilestonesMock,
  ...milestoneMock(modelID),
  ...categoryMock,
  ...solutionAndMilestoneMock
];

export default allMocks;
