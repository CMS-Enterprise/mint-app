/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GcPartCDType, GcCollectBidsType, GcUpdateContractType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetITCharacteristics
// ====================================================

export interface GetITCharacteristics_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  managePartCDEnrollment: boolean | null;
  collectPlanBids: boolean | null;
  planContactUpdated: boolean | null;
}

export interface GetITCharacteristics_modelPlan_itTools {
  __typename: "PlanITTools";
  id: UUID;
  gcPartCD: GcPartCDType[];
  gcPartCDOther: string | null;
  gcPartCDNote: string | null;
  gcCollectBids: GcCollectBidsType[];
  gcCollectBidsOther: string | null;
  gcCollectBidsNote: string | null;
  gcUpdateContract: GcUpdateContractType[];
  gcUpdateContractOther: string | null;
  gcUpdateContractNote: string | null;
}

export interface GetITCharacteristics_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  generalCharacteristics: GetITCharacteristics_modelPlan_generalCharacteristics;
  itTools: GetITCharacteristics_modelPlan_itTools;
}

export interface GetITCharacteristics {
  modelPlan: GetITCharacteristics_modelPlan;
}

export interface GetITCharacteristicsVariables {
  id: UUID;
}
