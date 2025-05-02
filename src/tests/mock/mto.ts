import { MockedResponse } from '@apollo/client/testing';
import {
  GetMilestoneSuggestedAnswerDocument,
  GetModelToOperationsMatrixDocument,
  GetModelToOperationsMatrixQuery,
  GetModelToOperationsMatrixQueryVariables,
  GetMtoAllMilestonesDocument,
  GetMtoAllMilestonesQuery,
  GetMtoAllMilestonesQueryVariables,
  GetMtoAllSolutionsDocument,
  GetMtoAllSolutionsQuery,
  GetMtoAllSolutionsQueryVariables,
  GetMtoCategoriesDocument,
  GetMtoCategoriesQuery,
  GetMtoCategoriesQueryVariables,
  GetMtoCommonSolutionsDocument,
  GetMtoCommonSolutionsQuery,
  GetMtoCommonSolutionsQueryVariables,
  GetMtoMilestoneDocument,
  GetMtoMilestoneQuery,
  GetMtoMilestoneQueryVariables,
  GetMtoMilestonesDocument,
  GetMtoMilestonesQuery,
  GetMtoMilestonesQueryVariables,
  GetMtoSolutionDocument,
  GetMtoSolutionQuery,
  GetMtoSolutionQueryVariables,
  GetMtoSolutionsAndMilestonesDocument,
  GetMtoSolutionsAndMilestonesQuery,
  GetMtoSolutionsAndMilestonesQueryVariables,
  GetPossibleSolutionsDocument,
  GetPossibleSolutionsQuery,
  GetPossibleSolutionsQueryVariables,
  MtoCommonMilestoneKey,
  MtoCommonSolutionKey,
  MtoCommonSolutionSubject,
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  MtoSolutionStatus,
  MtoSolutionType,
  MtoStatus,
  OperationalSolutionKey
} from 'gql/generated/graphql';

export const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

export const pointsOfContact = [
  {
    __typename: 'PossibleOperationalSolutionContact',
    id: '1267967874323',
    name: 'John Mint',
    email: 'john.mint@oddball.io',
    isTeam: false,
    role: 'Project lead',
    isPrimary: true
  }
];

export const mtoMatrixMock: MockedResponse<
  GetModelToOperationsMatrixQuery,
  GetModelToOperationsMatrixQueryVariables
>[] = [
  {
    request: {
      query: GetModelToOperationsMatrixDocument,
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
            status: MtoStatus.IN_PROGRESS,
            categories: [],
            info: {
              __typename: 'MTOInfo',
              id: 'info-id-123'
            },
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

export const mtoMatrixMockFull: MockedResponse<
  GetModelToOperationsMatrixQuery,
  GetModelToOperationsMatrixQueryVariables
>[] = [
  {
    request: {
      query: GetModelToOperationsMatrixDocument,
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
            status: MtoStatus.IN_PROGRESS,
            info: {
              __typename: 'MTOInfo',
              id: 'info-id-123'
            },
            categories: [
              {
                __typename: 'MTOCategory',
                id: '00000000-0000-0000-0000-000000000000',
                name: 'Uncategorized',
                isUncategorized: true as boolean,
                subCategories: [
                  {
                    __typename: 'MTOSubcategory',
                    id: '00000000-0000-0000-0000-000000000000',
                    name: 'Uncategorized',
                    isUncategorized: true,
                    milestones: [
                      {
                        __typename: 'MTOMilestone',
                        id: 'ca2f9f0d-1048-463e-a584-8ec0481122f9',
                        name: 'Acquire a learning contractor',
                        key: MtoCommonMilestoneKey.ACQUIRE_A_LEARN_CONT as MtoCommonMilestoneKey,
                        facilitatedBy: [
                          MtoFacilitator.MODEL_TEAM,
                          MtoFacilitator.MODEL_LEAD,
                          MtoFacilitator.LEARNING_CONTRACTOR,
                          MtoFacilitator.CONTRACTING_OFFICERS_REPRESENTATIVE,
                          MtoFacilitator.LEARNING_AND_DIFFUSION_GROUP
                        ],
                        // Removed needBy to match the expected type
                        status: MtoMilestoneStatus.NOT_STARTED,
                        riskIndicator: MtoRiskIndicator.ON_TRACK,
                        addedFromMilestoneLibrary: true,
                        needBy: '2022-05-12T15:01:39.190679Z',
                        isDraft: true,
                        solutions: [
                          {
                            __typename: 'MTOSolution',
                            id: 'a38fc2fa-30ab-45fe-b864-aff03348f56e',
                            name: 'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
                            key: MtoCommonSolutionKey.RMADA as MtoCommonSolutionKey
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ],
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: 'ca2f9f0d-1048-463e-a584-8ec0481122f9',
                name: 'Acquire a learning contractor',
                key: MtoCommonMilestoneKey.ACQUIRE_A_LEARN_CONT
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

export const allMilestoneMock: MockedResponse<
  GetMtoAllMilestonesQuery,
  GetMtoAllMilestonesQueryVariables
>[] = [
  {
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
            info: {
              __typename: 'MTOInfo',
              id: '123'
            },
            __typename: 'ModelsToOperationMatrix',
            milestones: [
              {
                __typename: 'MTOMilestone',
                id: '123',
                key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
                name: 'Milestone 1',
                status: MtoMilestoneStatus.NOT_STARTED,
                riskIndicator: MtoRiskIndicator.ON_TRACK,
                solutions: []
              }
            ],
            commonMilestones: []
          }
        }
      }
    }
  }
];

export const commonMilestonesMock: MockedResponse<
  GetMtoMilestonesQuery,
  GetMtoMilestonesQueryVariables
>[] = [
  {
    request: {
      query: GetMtoMilestonesDocument,
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
            info: {
              __typename: 'MTOInfo',
              id: 'info-id-123'
            },
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
                    __typename: 'MTOCommonSolution',
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

export const commonSolutionsMock: MockedResponse<
  GetMtoCommonSolutionsQuery,
  GetMtoCommonSolutionsQueryVariables
>[] = [
  {
    request: {
      query: GetMtoCommonSolutionsDocument,
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
            info: {
              __typename: 'MTOInfo',
              id: 'info-id-123'
            },
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

export const possibleSolutionsMock: MockedResponse<
  GetPossibleSolutionsQuery,
  GetPossibleSolutionsQueryVariables
>[] = [
  {
    request: {
      query: GetPossibleSolutionsDocument
    },
    result: {
      data: {
        __typename: 'Query',
        possibleOperationalSolutions: [
          {
            __typename: 'PossibleOperationalSolution',
            id: 123,
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

export const allMTOSolutionsMock: MockedResponse<
  GetMtoAllSolutionsQuery,
  GetMtoAllSolutionsQueryVariables
>[] = [
  {
    request: {
      query: GetMtoAllSolutionsDocument,
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
            info: {
              __typename: 'MTOInfo',
              id: 'info-id-123'
            },
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
                __typename: 'MTOSolution',
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

export const milestoneMock = (
  id: string
): MockedResponse<GetMtoMilestoneQuery, GetMtoMilestoneQueryVariables>[] => [
  {
    request: {
      query: GetMtoMilestoneDocument,
      variables: {
        id
      }
    },
    result: {
      data: {
        __typename: 'Query',
        mtoMilestone: {
          __typename: 'MTOMilestone',
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
            __typename: 'MTOCategories',
            category: {
              __typename: 'MTOCategory',
              id: '1',
              name: 'Category 1'
            },
            subCategory: {
              __typename: 'MTOSubcategory',
              id: '2',
              name: 'SubCategory 1'
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
              __typename: 'MTOSolution',
              id: '1',
              name: 'Solution 1',
              key: MtoCommonSolutionKey.BCDA,
              status: MtoSolutionStatus.COMPLETED,
              riskIndicator: MtoRiskIndicator.AT_RISK,
              commonSolution: {
                __typename: 'MTOCommonSolution',
                name: 'common solution 1',
                key: MtoCommonSolutionKey.BCDA,
                isAdded: true
              }
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
          info: {
            __typename: 'MTOInfo',
            id: '123'
          },
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

export const categoryMock: MockedResponse<
  GetMtoCategoriesQuery,
  GetMtoCategoriesQueryVariables
>[] = [
  {
    request: {
      query: GetMtoCategoriesDocument,
      variables: {
        id: modelID
      }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlan: {
          __typename: 'ModelPlan',
          mtoMatrix: {
            info: {
              __typename: 'MTOInfo',
              id: '123'
            },
            __typename: 'ModelsToOperationMatrix',
            categories: [
              {
                __typename: 'MTOCategory',
                id: '123',
                name: 'Category 1',
                subCategories: [
                  {
                    __typename: 'MTOSubcategory',
                    id: '123',
                    name: 'SubCategory 1'
                  }
                ]
              },
              {
                __typename: 'MTOCategory',
                id: '456',
                name: 'Category 2',
                subCategories: [
                  {
                    __typename: 'MTOSubcategory',
                    id: '123',
                    name: 'SubCategory 2'
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

export const solutionAndMilestoneMock: MockedResponse<
  GetMtoSolutionsAndMilestonesQuery,
  GetMtoSolutionsAndMilestonesQueryVariables
>[] = [
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
          id: modelID,
          mtoMatrix: {
            __typename: 'ModelsToOperationMatrix',
            status: MtoStatus.READY_FOR_REVIEW,
            recentEdit: {
              __typename: 'TranslatedAudit',
              id: '1',
              date: '2022-05-12T15:01:39.190679Z'
            },
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
            info: {
              __typename: 'MTOInfo',
              id: 'info-id-123'
            },
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
