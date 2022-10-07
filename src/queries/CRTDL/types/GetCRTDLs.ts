/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCRTDLs
// ====================================================

export interface GetCRTDLs_modelPlan_crTdls {
  __typename: "PlanCrTdl";
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
  crTdls: GetCRTDLs_modelPlan_crTdls[];
}

export interface GetCRTDLs {
  modelPlan: GetCRTDLs_modelPlan;
}

export interface GetCRTDLsVariables {
  id: UUID;
}
