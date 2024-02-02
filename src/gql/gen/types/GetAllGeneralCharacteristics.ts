/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ExisitingModelLinkFieldType, AgencyOrStateHelpType, AlternativePaymentModelType, KeyCharacteristic, GeographyType, StatesAndTerritories, GeographyRegionType, GeographyApplication, AgreementType, AuthorityAllowance, WaiverType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllGeneralCharacteristics
// ====================================================

export interface GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links_model_ExistingModel {
  __typename: "ExistingModel";
  modelName: string;
  stage: string;
  numberOfParticipants: string | null;
  keywords: string | null;
}

export interface GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links_model_ModelPlan {
  __typename: "ModelPlan";
  modelName: string;
  abbreviation: string | null;
}

export type GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links_model = GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links_model_ExistingModel | GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links_model_ModelPlan;

export interface GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links {
  __typename: "ExistingModelLink";
  id: UUID | null;
  existingModelID: number | null;
  currentModelPlanID: UUID | null;
  fieldName: ExisitingModelLinkFieldType;
  model: GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links_model;
}

export interface GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich {
  __typename: "ExistingModelLinks";
  links: GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links[];
}

export interface GetAllGeneralCharacteristics_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  isNewModel: boolean | null;
  existingModel: string | null;
  resemblesExistingModel: boolean | null;
  resemblesExistingModelHow: string | null;
  resemblesExistingModelNote: string | null;
  resemblesExistingModelWhich: GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich | null;
  hasComponentsOrTracks: boolean | null;
  hasComponentsOrTracksDiffer: string | null;
  hasComponentsOrTracksNote: string | null;
  agencyOrStateHelp: AgencyOrStateHelpType[];
  agencyOrStateHelpOther: string | null;
  agencyOrStateHelpNote: string | null;
  alternativePaymentModelTypes: AlternativePaymentModelType[];
  alternativePaymentModelNote: string | null;
  keyCharacteristics: KeyCharacteristic[];
  keyCharacteristicsOther: string | null;
  keyCharacteristicsNote: string | null;
  collectPlanBids: boolean | null;
  collectPlanBidsNote: string | null;
  managePartCDEnrollment: boolean | null;
  managePartCDEnrollmentNote: string | null;
  planContractUpdated: boolean | null;
  planContractUpdatedNote: string | null;
  careCoordinationInvolved: boolean | null;
  careCoordinationInvolvedDescription: string | null;
  careCoordinationInvolvedNote: string | null;
  additionalServicesInvolved: boolean | null;
  additionalServicesInvolvedDescription: string | null;
  additionalServicesInvolvedNote: string | null;
  communityPartnersInvolved: boolean | null;
  communityPartnersInvolvedDescription: string | null;
  communityPartnersInvolvedNote: string | null;
  geographiesTargeted: boolean | null;
  geographiesTargetedTypes: GeographyType[];
  geographiesStatesAndTerritories: StatesAndTerritories[];
  geographiesRegionTypes: GeographyRegionType[];
  geographiesTargetedTypesOther: string | null;
  geographiesTargetedAppliedTo: GeographyApplication[];
  geographiesTargetedAppliedToOther: string | null;
  geographiesTargetedNote: string | null;
  participationOptions: boolean | null;
  participationOptionsNote: string | null;
  agreementTypes: AgreementType[];
  agreementTypesOther: string | null;
  multiplePatricipationAgreementsNeeded: boolean | null;
  multiplePatricipationAgreementsNeededNote: string | null;
  rulemakingRequired: boolean | null;
  rulemakingRequiredDescription: string | null;
  rulemakingRequiredNote: string | null;
  authorityAllowances: AuthorityAllowance[];
  authorityAllowancesOther: string | null;
  authorityAllowancesNote: string | null;
  waiversRequired: boolean | null;
  waiversRequiredTypes: WaiverType[];
  waiversRequiredNote: string | null;
  status: TaskStatus;
}

export interface GetAllGeneralCharacteristics_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  generalCharacteristics: GetAllGeneralCharacteristics_modelPlan_generalCharacteristics;
}

export interface GetAllGeneralCharacteristics {
  modelPlan: GetAllGeneralCharacteristics_modelPlan;
}

export interface GetAllGeneralCharacteristicsVariables {
  id: UUID;
}
