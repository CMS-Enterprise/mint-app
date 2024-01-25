/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanTDLChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTDL
// ====================================================

export interface UpdateTDL_updatePlanTDL {
  __typename: "PlanTDL";
  id: UUID;
  modelPlanID: UUID;
  idNumber: string;
  dateInitiated: Time;
  title: string;
  note: string | null;
}

export interface UpdateTDL {
  updatePlanTDL: UpdateTDL_updatePlanTDL;
}

export interface UpdateTDLVariables {
  id: UUID;
  changes: PlanTDLChanges;
}
