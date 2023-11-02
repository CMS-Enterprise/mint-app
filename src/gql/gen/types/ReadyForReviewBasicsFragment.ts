/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: ReadyForReviewBasicsFragment
// ====================================================

export interface ReadyForReviewBasicsFragment_readyForReviewByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface ReadyForReviewBasicsFragment {
  __typename: "PlanBasics";
  readyForReviewByUserAccount: ReadyForReviewBasicsFragment_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}
