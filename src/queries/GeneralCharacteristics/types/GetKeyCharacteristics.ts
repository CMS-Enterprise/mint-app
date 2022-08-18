/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AlternativePaymentModelType, KeyCharacteristic, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetKeyCharacteristics
// ====================================================

export interface GetKeyCharacteristics_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  alternativePaymentModel: boolean | null;
  alternativePaymentModelTypes: AlternativePaymentModelType[];
  alternativePaymentModelNote: string | null;
  keyCharacteristics: KeyCharacteristic[];
  keyCharacteristicsNote: string | null;
  keyCharacteristicsOther: string | null;
  collectPlanBids: boolean | null;
  collectPlanBidsNote: string | null;
  managePartCDEnrollment: boolean | null;
  managePartCDEnrollmentNote: string | null;
  planContactUpdated: boolean | null;
  planContactUpdatedNote: string | null;
}

export interface GetKeyCharacteristics_modelPlan_itTools {
  __typename: "PlanITTools";
  status: TaskStatus;
}

export interface GetKeyCharacteristics_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  generalCharacteristics: GetKeyCharacteristics_modelPlan_generalCharacteristics;
  itTools: GetKeyCharacteristics_modelPlan_itTools;
}

export interface GetKeyCharacteristics {
  modelPlan: GetKeyCharacteristics_modelPlan;
}

export interface GetKeyCharacteristicsVariables {
  id: UUID;
}
