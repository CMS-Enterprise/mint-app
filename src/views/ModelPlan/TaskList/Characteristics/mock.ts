import GetModelPlanCharacteristics from 'queries/GetModelPlanCharacteristics';
import { GetModelPlanCharacteristics_modelPlan_generalCharacteristics as ModelPlanCharacteristicsType } from 'queries/types/GetModelPlanCharacteristics';
import {
  GeographyType,
  KeyCharacteristic,
  TaskStatus
} from 'types/graphql-global-types';

export const charactersticMockData: ModelPlanCharacteristicsType = {
  __typename: 'PlanGeneralCharacteristics',
  id: '123',
  modelPlanID: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
  isNewModel: false,
  existingModel: 'Second Plan',
  resemblesExistingModel: false,
  resemblesExistingModelWhich: [],
  resemblesExistingModelHow: '',
  resemblesExistingModelNote: '',
  hasComponentsOrTracks: true,
  hasComponentsOrTracksDiffer: 'Differ text',
  hasComponentsOrTracksNote: 'Component note',
  alternativePaymentModel: false,
  alternativePaymentModelTypes: [],
  alternativePaymentModelNote: '',
  keyCharacteristics: ['OTHER' as KeyCharacteristic],
  keyCharacteristicsOther: 'Key other note',
  keyCharacteristicsNote: '',
  collectPlanBids: false,
  collectPlanBidsNote: '',
  managePartCDEnrollment: false,
  managePartCDEnrollmentNote: '',
  planContactUpdated: false,
  planContactUpdatedNote: '',
  careCoordinationInvolved: false,
  careCoordinationInvolvedDescription: '',
  careCoordinationInvolvedNote: '',
  additionalServicesInvolved: true,
  additionalServicesInvolvedDescription: 'Lots of additional services',
  additionalServicesInvolvedNote: '',
  communityPartnersInvolved: false,
  communityPartnersInvolvedDescription: '',
  communityPartnersInvolvedNote: '',
  geographiesTargeted: true,
  geographiesTargetedTypes: ['OTHER' as GeographyType],
  geographiesTargetedTypesOther: 'Other geography type',
  geographiesTargetedAppliedTo: [],
  geographiesTargetedAppliedToOther: '',
  geographiesTargetedNote: '',
  participationOptions: false,
  participationOptionsNote: '',
  agreementTypes: [],
  agreementTypesOther: '',
  multiplePatricipationAgreementsNeeded: false,
  multiplePatricipationAgreementsNeededNote: '',
  rulemakingRequired: true,
  rulemakingRequiredDescription: 'Yes rulemaking is required',
  rulemakingRequiredNote: '',
  authorityAllowances: [],
  authorityAllowancesOther: '',
  authorityAllowancesNote: '',
  waiversRequired: false,
  waiversRequiredTypes: [],
  waiversRequiredNote: '',
  createdBy: '',
  createdDts: '',
  modifiedBy: '',
  modifiedDts: '',
  status: TaskStatus.COMPLETE
};

const charactersticMock = [
  {
    request: {
      query: GetModelPlanCharacteristics,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          modelName: 'My excellent plan that I just initiated',
          generalCharacteristics: charactersticMockData
        }
      }
    }
  }
];

export default charactersticMock;
