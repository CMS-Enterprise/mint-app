import {
  GetMilestoneSuggestedAnswerDocument,
  GetMtoAllSolutionsDocument,
  GetMtoCategoriesDocument,
  GetMtoCommonSolutionsDocument,
  GetMtoMilestoneDocument,
  GetMtoMilestonesDocument,
  GetPossibleSolutionsDocument,
  MtoCommonMilestoneKey,
  MtoCommonSolutionKey,
  MtoCommonSolutionSubject,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  MtoSolutionType,
  OperationalSolutionKey
} from 'gql/generated/graphql';

export const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

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

const allMocks = [
  ...suggestedMilestonesMock,
  ...commonMilestonesMock,
  ...milestoneMock(modelID),
  ...categoryMock
];

export default allMocks;
