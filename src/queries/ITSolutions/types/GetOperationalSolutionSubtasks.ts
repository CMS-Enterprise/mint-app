/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalSolutionSubtaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetOperationalSolutionSubtasks
// ====================================================

export interface GetOperationalSolutionSubtasks_operationalSolution_operationalSolutionSubtasks {
  __typename: "OperationalSolutionSubtask";
  id: UUID;
  solutionID: UUID;
  name: string;
  status: OperationalSolutionSubtaskStatus;
}

export interface GetOperationalSolutionSubtasks_operationalSolution {
  __typename: "OperationalSolution";
  id: UUID;
  operationalSolutionSubtasks: GetOperationalSolutionSubtasks_operationalSolution_operationalSolutionSubtasks[];
}

export interface GetOperationalSolutionSubtasks {
  operationalSolution: GetOperationalSolutionSubtasks_operationalSolution;
}

export interface GetOperationalSolutionSubtasksVariables {
  id: UUID;
}
