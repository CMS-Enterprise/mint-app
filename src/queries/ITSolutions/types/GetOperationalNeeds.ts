/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalNeedKey, OpSolutionStatus, OperationalSolutionKey } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetOperationalNeeds
// ====================================================

export interface GetOperationalNeeds_modelPlan_operationalNeeds_solutions_operationalSolutionSubtasks {
  __typename: "OperationalSolutionSubtask";
  id: UUID;
}

export interface GetOperationalNeeds_modelPlan_operationalNeeds_solutions {
  __typename: "OperationalSolution";
  id: UUID;
  status: OpSolutionStatus;
  name: string | null;
  mustStartDts: Time | null;
  mustFinishDts: Time | null;
  needed: boolean | null;
  nameOther: string | null;
  key: OperationalSolutionKey | null;
  otherHeader: string | null;
  operationalSolutionSubtasks: GetOperationalNeeds_modelPlan_operationalNeeds_solutions_operationalSolutionSubtasks[];
  pocEmail: string | null;
  pocName: string | null;
  createdBy: UUID;
  createdDts: Time;
}

export interface GetOperationalNeeds_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  id: UUID;
  modelPlanID: UUID;
  name: string | null;
  key: OperationalNeedKey | null;
  nameOther: string | null;
  needed: boolean | null;
  modifiedDts: Time | null;
  solutions: GetOperationalNeeds_modelPlan_operationalNeeds_solutions[];
}

export interface GetOperationalNeeds_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  isCollaborator: boolean;
  operationalNeeds: GetOperationalNeeds_modelPlan_operationalNeeds[];
}

export interface GetOperationalNeeds {
  modelPlan: GetOperationalNeeds_modelPlan;
}

export interface GetOperationalNeedsVariables {
  id: UUID;
}
