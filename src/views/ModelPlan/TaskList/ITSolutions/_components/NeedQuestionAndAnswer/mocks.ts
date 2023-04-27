import GetOperationalNeed from 'queries/ITSolutions/GetOperationalNeed';
import GetOperationalNeedAnswer from 'queries/ITSolutions/GetOperationalNeedAnswer';
import {
  OperationalNeedKey,
  OperationalSolutionKey,
  OpSolutionStatus
} from 'types/graphql-global-types';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';

const needQuestionAndAnswerMock = [
  {
    request: {
      query: GetOperationalNeed,
      variables: {
        id: operationalNeedID,
        includeNotNeeded: false
      }
    },
    result: {
      data: {
        operationalNeed: {
          __typename: 'OperationalNeed',
          id: operationalNeedID,
          modelPlanID: modelID,
          name: 'Obtain an application support contractor',
          key: OperationalNeedKey.APP_SUPPORT_CON,
          nameOther: null,
          needed: true,
          solutions: [
            {
              __typename: 'OperationalSolution',
              id: '00000000-0000-0000-0000-000000000000',
              name:
                'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
              key: OperationalSolutionKey.RMADA,
              pocName: null,
              pocEmail: null,
              needed: null,
              nameOther: null,
              mustStartDts: null,
              mustFinishDts: null,
              status: OpSolutionStatus.NOT_STARTED
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: GetOperationalNeedAnswer,
      skip: false,
      variables: {
        id: modelID,
        generalCharacteristics: false,
        participantsAndProviders: true,
        beneficiaries: false,
        opsEvalAndLearning: false,
        payments: false,
        managePartCDEnrollment: false,
        collectPlanBids: false,
        planContractUpdated: false,
        agreementTypes: false,
        recruitmentMethod: false,
        selectionMethod: true,
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
        evaluationApproaches: false,
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
          modelName: 'Empty Plan',
          participantsAndProviders: {
            __typename: 'PlanParticipantsAndProviders',
            selectionMethod: [
              'APPLICATION_REVIEW_AND_SCORING_TOOL',
              'APPLICATION_SUPPORT_CONTRACTOR'
            ]
          }
        }
      }
    }
  }
];

export default needQuestionAndAnswerMock;
