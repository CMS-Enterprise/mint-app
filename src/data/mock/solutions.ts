import GetPossibleSolutions from 'gql/apolloGQL/Solutions/GetPossibleSolutions';
import {
  GetOperationalNeedAnswerDocument,
  GetOperationalNeedDocument,
  OperationalNeedKey,
  OperationalSolutionKey,
  OpSolutionStatus
} from 'gql/gen/graphql';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';

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

export const possibleSolutionsMock = [
  {
    request: {
      query: GetPossibleSolutions
    },
    result: {
      data: {
        possibleOperationalSolutions: [
          {
            __typname: 'PossibleOperationalSolution',
            id: '1267679i6867663',
            key: OperationalSolutionKey.INNOVATION,
            pointsOfContact: [...pointsOfContact]
          },
          {
            __typname: 'PossibleOperationalSolution',
            id: '2345256',
            key: OperationalSolutionKey.ACO_OS,
            pointsOfContact: [
              {
                __typename: 'PossibleOperationalSolutionContact',
                id: '235234',
                name: '4Inn/Aco',
                email: '4inn.mint@oddball.io',
                isTeam: true,
                role: '',
                isPrimary: true
              }
            ]
          },
          {
            __typname: 'PossibleOperationalSolution',
            id: '78968679',
            key: OperationalSolutionKey.APPS,
            pointsOfContact: [
              {
                __typename: 'PossibleOperationalSolutionContact',
                id: '454576365436',
                name: 'Brandon Bee',
                email: 'bee.mint@oddball.io',
                isTeam: false,
                role: 'CMMI Government Task Lead',
                isPrimary: true
              }
            ]
          },
          {
            __typname: 'PossibleOperationalSolution',
            id: '116785636',
            key: OperationalSolutionKey.RMADA,
            pointsOfContact: [
              {
                __typename: 'PossibleOperationalSolutionContact',
                id: '4512341356',
                name: 'Alicia Thomas',
                email: 'at.mint@oddball.io',
                isTeam: false,
                role: 'Beneficiary Listening Session Point of Contact',
                isPrimary: true
              }
            ]
          }
        ]
      }
    }
  }
];

export const needQuestionAndAnswerMock = [
  {
    request: {
      query: GetOperationalNeedDocument,
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
          isOther: false,
          otherHeader: null,
          needed: true,
          solutions: [
            {
              __typename: 'OperationalSolution',
              id: '00000000-0000-0000-0000-000000000000',
              name:
                'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
              key: OperationalSolutionKey.RMADA,
              isOther: false,
              isCommonSolution: true,
              otherHeader: null,
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
      query: GetOperationalNeedAnswerDocument,
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

export const operationalNeedMock = (includeNotNeeded: boolean = false) => [
  {
    request: {
      query: GetOperationalNeedDocument,
      variables: {
        id: operationalNeedID,
        includeNotNeeded
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
              pocName: 'John Doe',
              pocEmail: '',
              needed: null,
              nameOther: null,
              isOther: false,
              isCommonSolution: true,
              otherHeader: null,
              mustStartDts: null,
              mustFinishDts: null,
              status: OpSolutionStatus.AT_RISK
            }
          ]
        }
      }
    }
  }
];

const allMocks = [
  ...possibleSolutionsMock,
  ...needQuestionAndAnswerMock,
  ...operationalNeedMock()
];

export default allMocks;
