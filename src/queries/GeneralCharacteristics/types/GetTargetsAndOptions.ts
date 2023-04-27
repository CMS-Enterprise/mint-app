/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GeographyType, GeographyApplication, AgreementType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTargetsAndOptions
// ====================================================

export interface GetTargetsAndOptions_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  geographiesTargeted: boolean | null;
  geographiesTargetedTypes: GeographyType[];
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
}

export interface GetTargetsAndOptions_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  id: UUID;
  modifiedDts: Time | null;
}

export interface GetTargetsAndOptions_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  generalCharacteristics: GetTargetsAndOptions_modelPlan_generalCharacteristics;
  operationalNeeds: GetTargetsAndOptions_modelPlan_operationalNeeds[];
}

export interface GetTargetsAndOptions {
  modelPlan: GetTargetsAndOptions_modelPlan;
}

export interface GetTargetsAndOptionsVariables {
  id: UUID;
}
