/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalSolutionChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateOperationalSolution
// ====================================================

export interface UpdateOperationalSolution_updateOperationalSolution {
  __typename: "OperationalSolution";
  id: UUID;
}

export interface UpdateOperationalSolution {
  updateOperationalSolution: UpdateOperationalSolution_updateOperationalSolution;
}

export interface UpdateOperationalSolutionVariables {
  id: UUID;
  changes: OperationalSolutionChanges;
}
