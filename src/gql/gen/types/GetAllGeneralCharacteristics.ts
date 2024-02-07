/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { YesNoOtherType, AgencyOrStateHelpType, AlternativePaymentModelType, KeyCharacteristic, GeographyType, StatesAndTerritories, GeographyRegionType, GeographyApplication, AgreementType, AuthorityAllowance, WaiverType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllGeneralCharacteristics
// ====================================================

export interface GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich {
  __typename: "ExistingModelLinks";
  names: string[];
}

export interface GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_participationInModelPreconditionWhich {
  __typename: "ExistingModelLinks";
  names: string[];
}

export interface GetAllGeneralCharacteristics_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  isNewModel: boolean | null;
  existingModel: string | null;
  resemblesExistingModel: YesNoOtherType | null;
  /**
   * For providing clarifying comments if Yes or No is selected for resemblesExistingModel
   */
  resemblesExistingModelWhyHow: string | null;
  resemblesExistingModelHow: string | null;
  resemblesExistingModelNote: string | null;
  resemblesExistingModelWhich: GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich | null;
  /**
   * For providing clarifying comments if Other is selected for resemblesExistingModel
   */
  resemblesExistingModelOtherSpecify: string | null;
  /**
   * For denoting if there is an other model that this model resembles if it's true that it resembles existing models.
   */
  resemblesExistingModelOtherSelected: boolean | null;
  /**
   * For denoting the name of the other existing model that this model resembles
   */
  resemblesExistingModelOtherOption: string | null;
  /**
   * For answering if participation in other models is a precondition for participating in this model
   */
  participationInModelPrecondition: YesNoOtherType | null;
  /**
   * The collection of existing model links relevant to the participationInModelPrecondition question
   */
  participationInModelPreconditionWhich: GetAllGeneralCharacteristics_modelPlan_generalCharacteristics_participationInModelPreconditionWhich | null;
  /**
   * For providing clarifying comments if Other is selected for participationInModelPrecondition
   */
  participationInModelPreconditionOtherSpecify: string | null;
  /**
   * For denoting if there is an other model that this model refers to.
   */
  participationInModelPreconditionOtherSelected: boolean | null;
  /**
   * For denoting the name of the other existing model
   */
  participationInModelPreconditionOtherOption: string | null;
  /**
   * For providing clarifying comments if Yes or No is selected for participationInModelPrecondition
   */
  participationInModelPreconditionWhyHow: string | null;
  /**
   * A note field for participationInModelPrecondition
   */
  participationInModelPreconditionNote: string | null;
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
