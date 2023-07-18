import GetAllBeneficiaries from 'queries/ReadOnly/GetAllBeneficiaries';
import GetModelSummary from 'queries/ReadOnly/GetModelSummary';
import { GetAllBeneficiaries_modelPlan_beneficiaries as AllBeneficiariesTypes } from 'queries/ReadOnly/types/GetAllBeneficiaries';
import { GetModelSummary_modelPlan as GetModelSummaryTypes } from 'queries/ReadOnly/types/GetModelSummary';
import {
  BeneficiariesType,
  ConfidenceType,
  FrequencyType,
  KeyCharacteristic,
  ModelStatus,
  OverlapType,
  SelectionMethodType,
  TaskStatus,
  TeamRole,
  TriStateAnswer
} from 'types/graphql-global-types';

export const modelID: string = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const beneficiaryData: AllBeneficiariesTypes = {
  __typename: 'PlanBeneficiaries',
  id: '123',
  modelPlanID: modelID,
  beneficiaries: [
    BeneficiariesType.DISEASE_SPECIFIC,
    BeneficiariesType.DUALLY_ELIGIBLE
  ],
  beneficiariesOther: null,
  beneficiariesNote: null,
  treatDualElligibleDifferent: TriStateAnswer.YES,
  treatDualElligibleDifferentHow: 'null',
  treatDualElligibleDifferentNote: null,
  excludeCertainCharacteristics: TriStateAnswer.NO,
  excludeCertainCharacteristicsCriteria: null,
  excludeCertainCharacteristicsNote: null,
  numberPeopleImpacted: 1234,
  estimateConfidence: ConfidenceType.COMPLETELY,
  confidenceNote: null,
  beneficiarySelectionMethod: [SelectionMethodType.HISTORICAL],
  beneficiarySelectionOther: null,
  beneficiarySelectionNote: null,
  beneficiarySelectionFrequency: FrequencyType.ANNUALLY,
  beneficiarySelectionFrequencyOther: null,
  beneficiarySelectionFrequencyNote: null,
  beneficiaryOverlap: OverlapType.YES_NEED_POLICIES,
  beneficiaryOverlapNote: null,
  precedenceRules: null,
  status: TaskStatus.IN_PROGRESS
};

export const benficiaryMocks = [
  {
    request: {
      query: GetAllBeneficiaries,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          beneficiaries: beneficiaryData
        }
      }
    }
  }
];

const summaryData: GetModelSummaryTypes = {
  __typename: 'ModelPlan',
  id: modelID,
  isFavorite: false,
  modelName: 'Testing Model Summary',
  abbreviation: 'TMS',
  createdDts: '2022-08-23T04:00:00Z',
  modifiedDts: '2022-08-27T04:00:00Z',
  status: ModelStatus.PLAN_DRAFT,
  basics: {
    __typename: 'PlanBasics',
    goal: 'This is the goal',
    performancePeriodStarts: '2022-08-20T04:00:00Z'
  },
  generalCharacteristics: {
    __typename: 'PlanGeneralCharacteristics',
    keyCharacteristics: [KeyCharacteristic.EPISODE_BASED]
  },
  isCollaborator: true,

  collaborators: [
    {
      userAccount: {
        id: '890',
        __typename: 'UserAccount',
        email: '',
        username: 'MINT',
        commonName: 'First Collaborator'
      },
      teamRole: TeamRole.MODEL_LEAD,
      __typename: 'PlanCollaborator'
    }
  ],
  crTdls: [
    {
      __typename: 'PlanCrTdl',
      idNumber: 'TDL-123'
    }
  ]
};

export const summaryMock = [
  {
    request: {
      query: GetModelSummary,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          ...summaryData
        }
      }
    }
  }
];

export default summaryMock;
