import {
  GetMilestoneSuggestedAnswerDocument,
  GetMtoMilestonesDocument
} from 'gql/generated/graphql';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

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
            commonMilestones: [
              {
                __typename: 'MTOCommonMilestone',
                name: 'Test Milestone',
                key: 'ACQUIRE_AN_EVAL_CONT',
                isAdded: false,
                isSuggested: true,
                categoryName: 'Test Category',
                subCategoryName: 'Test SubCategory'
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

const allMocks = [...suggestedMilestonesMock, ...commonMilestonesMock];

export default allMocks;
