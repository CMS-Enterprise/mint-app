/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AlternativePaymentModelType, KeyCharacteristic } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetKeyCharacteristics
// ====================================================

export interface GetKeyCharacteristics_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  alternativePaymentModelTypes: AlternativePaymentModelType[];
  alternativePaymentModelNote: string | null;
  keyCharacteristics: KeyCharacteristic[];
  keyCharacteristicsNote: string | null;
  keyCharacteristicsOther: string | null;
  collectPlanBids: boolean | null;
  collectPlanBidsNote: string | null;
  managePartCDEnrollment: boolean | null;
  managePartCDEnrollmentNote: string | null;
  planContractUpdated: boolean | null;
  planContractUpdatedNote: string | null;
}

export interface GetKeyCharacteristics_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  modifiedDts: Time | null;
}

export interface GetKeyCharacteristics_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  generalCharacteristics: GetKeyCharacteristics_modelPlan_generalCharacteristics;
  operationalNeeds: GetKeyCharacteristics_modelPlan_operationalNeeds[];
}

export interface GetKeyCharacteristics {
  modelPlan: GetKeyCharacteristics_modelPlan;
}

export interface GetKeyCharacteristicsVariables {
  id: UUID;
}
