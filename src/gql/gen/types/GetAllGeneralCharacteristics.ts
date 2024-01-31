/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AgencyOrStateHelpType, AlternativePaymentModelType, KeyCharacteristic, GeographyType, StatesAndTerritories, GeographyRegionType, GeographyApplication, AgreementType, AuthorityAllowance, WaiverType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllGeneralCharacteristics
// ====================================================

export interface GetAllGeneralCharacteristics_modelPlan_existingModelLinks_existingModel {
  __typename: "ExistingModel";
  id: number | null;
  modelName: string | null;
}

export interface GetAllGeneralCharacteristics_modelPlan_existingModelLinks_currentModelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
}

export interface GetAllGeneralCharacteristics_modelPlan_existingModelLinks {
  __typename: "ExistingModelLink";
  id: UUID | null;
  existingModel: GetAllGeneralCharacteristics_modelPlan_existingModelLinks_existingModel | null;
  currentModelPlan: GetAllGeneralCharacteristics_modelPlan_existingModelLinks_currentModelPlan | null;
}

export interface GetAllGeneralCharacteristics_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  isNewModel: boolean | null;
  existingModel: string | null;
  resemblesExistingModel: boolean | null;
  resemblesExistingModelHow: string | null;
  resemblesExistingModelNote: string | null;
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
  existingModelLinks: GetAllGeneralCharacteristics_modelPlan_existingModelLinks[];
  generalCharacteristics: GetAllGeneralCharacteristics_modelPlan_generalCharacteristics;
}

export interface GetAllGeneralCharacteristics {
  modelPlan: GetAllGeneralCharacteristics_modelPlan;
}

export interface GetAllGeneralCharacteristicsVariables {
  id: UUID;
}
