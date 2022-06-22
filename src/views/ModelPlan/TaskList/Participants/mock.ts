import GetModelPlanParticipantsAndProviders from 'queries/GetModelPlanParticipantsAndProviders';
import { GetModelPlanProvidersAndParticipants_modelPlan_participantsAndProviders as ModelPlanParticipantsAndProvidersType } from 'queries/types/GetModelPlanProvidersAndParticipants';
import {
  ParticipantRiskType,
  ParticipantsIDType,
  ParticipantsType,
  ProviderAddType,
  TaskStatus
} from 'types/graphql-global-types';

export const participantsAndProvidersData: ModelPlanParticipantsAndProvidersType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '123',
  modelPlanID: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
  participants: [
    'MEDICARE_PROVIDERS' as ParticipantsType,
    'STATES' as ParticipantsType,
    'OTHER' as ParticipantsType
  ],
  medicareProviderType: 'Oncology Providers',
  statesEngagement:
    'States will determine administration specific to the state',
  participantsOther: 'The candy people',
  participantsNote: '',
  participantsCurrentlyInModels: null,
  participantsCurrentlyInModelsNote: '',
  modelApplicationLevel: 'c92.00 and c92.01',
  expectedNumberOfParticipants: 350,
  estimateConfidence: null,
  confidenceNote: '',
  recruitmentMethod: null,
  recruitmentOther: '',
  recruitmentNote: '',
  selectionMethod: [],
  selectionOther: '',
  selectionNote: '',
  communicationMethod: [],
  communicationNote: '',
  participantAssumeRisk: true,
  riskType: 'OTHER' as ParticipantRiskType,
  riskOther: 'Programmatic Risk',
  riskNote: '',
  willRiskChange: null,
  willRiskChangeNote: '',
  coordinateWork: null,
  coordinateWorkNote: '',
  gainsharePayments: null,
  gainsharePaymentsTrack: null,
  gainsharePaymentsNote: '',
  participantsIds: ['OTHER' as ParticipantsIDType],
  participantsIdsOther: 'Candy Kingdom Operations Number',
  participantsIDSNote: '',
  providerAdditionFrequency: null,
  providerAdditionFrequencyOther: '',
  providerAdditionFrequencyNote: '',
  providerAddMethod: ['OTHER' as ProviderAddType],
  providerAddMethodOther: 'Competitive ball-room dancing, free for all',
  providerAddMethodNote: '',
  providerLeaveMethod: [],
  providerLeaveMethodOther: '',
  providerLeaveMethodNote: '',
  providerOverlap: null,
  providerOverlapHierarchy: '',
  providerOverlapNote: '',
  createdBy: '',
  createdDts: '',
  modifiedBy: '',
  modifiedDts: '',
  status: TaskStatus.COMPLETE
};

const participantsAndProvidersMock = [
  {
    request: {
      query: GetModelPlanParticipantsAndProviders,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          modelName: 'My excellent plan that I just initiated',
          participantsAndProviders: participantsAndProvidersData
        }
      }
    }
  }
];

export default participantsAndProvidersMock;
