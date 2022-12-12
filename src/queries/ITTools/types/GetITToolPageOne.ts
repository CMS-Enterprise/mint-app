/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GcPartCDType, GcCollectBidsType, GcUpdateContractType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetITToolPageOne
// ====================================================

export interface GetITToolPageOne_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  managePartCDEnrollment: boolean | null;
  collectPlanBids: boolean | null;
  planContractUpdated: boolean | null;
}

export interface GetITToolPageOne_modelPlan_itTools {
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

export interface GetITToolPageOne_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  generalCharacteristics: GetITToolPageOne_modelPlan_generalCharacteristics;
  itTools: GetITToolPageOne_modelPlan_itTools;
}

export interface GetITToolPageOne {
  modelPlan: GetITToolPageOne_modelPlan;
}

export interface GetITToolPageOneVariables {
  id: UUID;
}
