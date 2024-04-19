/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalSolutionChanges, OperationalSolutionKey } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateOperationalSolution
// ====================================================

export interface UpdateOperationalSolution_updateOperationalSolution {
  __typename: "OperationalSolution";
  id: UUID;
  nameOther: string | null;
  needed: boolean | null;
  key: OperationalSolutionKey | null;
}

export interface UpdateOperationalSolution {
  updateOperationalSolution: UpdateOperationalSolution_updateOperationalSolution;
}

export interface UpdateOperationalSolutionVariables {
  id: UUID;
  changes: OperationalSolutionChanges;
}
