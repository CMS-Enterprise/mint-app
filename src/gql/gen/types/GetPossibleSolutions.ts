/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OperationalSolutionKey } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetPossibleSolutions
// ====================================================

export interface GetPossibleSolutions_possibleOperationalSolutions_pointsOfContact {
  __typename: "PossibleOperationalSolutionContact";
  id: UUID;
  name: string;
  email: string;
  isTeam: boolean;
  isPrimary: boolean | null;
  role: string | null;
}

export interface GetPossibleSolutions_possibleOperationalSolutions {
  __typename: "PossibleOperationalSolution";
  id: number;
  key: OperationalSolutionKey;
  pointsOfContact: GetPossibleSolutions_possibleOperationalSolutions_pointsOfContact[];
}

export interface GetPossibleSolutions {
  possibleOperationalSolutions: GetPossibleSolutions_possibleOperationalSolutions[];
}
