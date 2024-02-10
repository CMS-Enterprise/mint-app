/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCRTDLs
// ====================================================

export interface GetCRTDLs_modelPlan_crs {
  __typename: "PlanCR";
  id: UUID;
  modelPlanID: UUID;
  title: string;
  idNumber: string;
  dateInitiated: Time;
  dateImplemented: Time | null;
  note: string | null;
}

export interface GetCRTDLs_modelPlan_tdls {
  __typename: "PlanTDL";
  id: UUID;
  modelPlanID: UUID;
  title: string;
  idNumber: string;
  dateInitiated: Time;
  note: string | null;
}

export interface GetCRTDLs_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  isCollaborator: boolean;
  crs: GetCRTDLs_modelPlan_crs[];
  tdls: GetCRTDLs_modelPlan_tdls[];
}

export interface GetCRTDLs {
  modelPlan: GetCRTDLs_modelPlan;
}

export interface GetCRTDLsVariables {
  id: UUID;
}
