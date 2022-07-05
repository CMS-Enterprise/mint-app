import GetModelPlanBeneficiaries from 'queries/GetModelPlanBeneficiaries';
import { GetModelPlanBeneficiaries_modelPlan_beneficiaries as ModelPlanBeneficiariesType } from 'queries/types/GetModelPlanBeneficiaries';
import {
  BeneficiariesType,
  ConfidenceType,
  FrequencyType,
  OverlapType,
  SelectionMethodType,
  TaskStatus,
  TriStateAnswer
} from 'types/graphql-global-types';

export const beneficiaryMockData: ModelPlanBeneficiariesType = {
  __typename: 'PlanBeneficiaries',
  id: '123',
  modelPlanID: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
  beneficiaries: ['OTHER' as BeneficiariesType],
  beneficiariesOther: 'Other Note',
  beneficiariesNote: '',
  treatDualElligibleDifferent: 'YES' as TriStateAnswer,
  treatDualElligibleDifferentHow: 'Differ text',
  treatDualElligibleDifferentNote: '',
  excludeCertainCharacteristics: 'YES' as TriStateAnswer,
  excludeCertainCharacteristicsCriteria: '',
  excludeCertainCharacteristicsNote: '',
  numberPeopleImpacted: 100,
  estimateConfidence: 'COMPLETELY' as ConfidenceType,
  confidenceNote: '',
  beneficiarySelectionNote: '',
  beneficiarySelectionOther: '',
  beneficiarySelectionMethod: ['HISTORICAL' as SelectionMethodType],
  beneficiarySelectionFrequency: 'ANNUALLY' as FrequencyType,
  beneficiarySelectionFrequencyNote: '',
  beneficiarySelectionFrequencyOther: '',
  beneficiaryOverlap: 'YES_NO_ISSUES' as OverlapType,
  beneficiaryOverlapNote: '',
  precedenceRules: '',
  createdBy: '',
  createdDts: '',
  modifiedBy: '',
  modifiedDts: '',
  status: TaskStatus.COMPLETE
};

const beneficiaryMock = [
  {
    request: {
      query: GetModelPlanBeneficiaries,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: '1029',
          modelName: 'My excellent plan that I just initiated',
          generalCharacteristics: beneficiaryMockData
        }
      }
    }
  }
];

export default beneficiaryMock;
