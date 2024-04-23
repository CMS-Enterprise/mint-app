/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateOperationalSolutionSubtaskInput, OperationalSolutionSubtaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateOperationalSolutionSubtasks
// ====================================================

export interface UpdateOperationalSolutionSubtasks_updateOperationalSolutionSubtasks {
  __typename: "OperationalSolutionSubtask";
  id: UUID;
  solutionID: UUID;
  name: string;
  status: OperationalSolutionSubtaskStatus;
}

export interface UpdateOperationalSolutionSubtasks {
  updateOperationalSolutionSubtasks: UpdateOperationalSolutionSubtasks_updateOperationalSolutionSubtasks[] | null;
}

export interface UpdateOperationalSolutionSubtasksVariables {
  inputs: UpdateOperationalSolutionSubtaskInput[];
}
