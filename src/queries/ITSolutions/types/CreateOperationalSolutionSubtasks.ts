/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateOperationalSolutionSubtaskInput, OperationalSolutionSubtaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateOperationalSolutionSubtasks
// ====================================================

export interface CreateOperationalSolutionSubtasks_createOperationalSolutionSubtasks {
  __typename: "OperationalSolutionSubtask";
  name: string;
  status: OperationalSolutionSubtaskStatus;
}

export interface CreateOperationalSolutionSubtasks {
  createOperationalSolutionSubtasks: CreateOperationalSolutionSubtasks_createOperationalSolutionSubtasks[] | null;
}

export interface CreateOperationalSolutionSubtasksVariables {
  solutionID: UUID;
  inputs: CreateOperationalSolutionSubtaskInput[];
}
