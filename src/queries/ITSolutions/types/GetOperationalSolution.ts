/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalSolutionKey } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetOperationalSolution
// ====================================================

export interface GetOperationalSolution_operationalSolution {
  __typename: "OperationalSolution";
  id: UUID;
  key: OperationalSolutionKey | null;
  needed: boolean | null;
  name: string | null;
  nameOther: string | null;
  pocName: string | null;
  pocEmail: string | null;
}

export interface GetOperationalSolution {
  operationalSolution: GetOperationalSolution_operationalSolution;
}

export interface GetOperationalSolutionVariables {
  id: UUID;
}
