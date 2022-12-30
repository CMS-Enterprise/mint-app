/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalSolutionChanges, OperationalSolutionKey } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateCustomOperationalSolutionByID
// ====================================================

export interface UpdateCustomOperationalSolutionByID_updateCustomOperationalSolutionByID {
  __typename: "OperationalSolution";
  id: UUID;
  nameOther: string | null;
  needed: boolean | null;
  key: OperationalSolutionKey | null;
}

export interface UpdateCustomOperationalSolutionByID {
  updateCustomOperationalSolutionByID: UpdateCustomOperationalSolutionByID_updateCustomOperationalSolutionByID;
}

export interface UpdateCustomOperationalSolutionByIDVariables {
  id: UUID;
  customSolutionType: string;
  changes: OperationalSolutionChanges;
}
