/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalSolutionKey } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetPossibleOperationalSolutions
// ====================================================

export interface GetPossibleOperationalSolutions_possibleOperationalSolutions {
  __typename: "PossibleOperationalSolution";
  id: number;
  name: string;
  key: OperationalSolutionKey;
}

export interface GetPossibleOperationalSolutions {
  possibleOperationalSolutions: GetPossibleOperationalSolutions_possibleOperationalSolutions[];
}
