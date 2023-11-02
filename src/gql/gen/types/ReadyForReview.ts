/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: ReadyForReview
// ====================================================

export interface ReadyForReview_readyForReviewByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface ReadyForReview {
  __typename: "PlanBasics";
  readyForReviewByUserAccount: ReadyForReview_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}
