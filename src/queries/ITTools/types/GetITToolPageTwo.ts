/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RecruitmentType, ParticipantSelectionType, PpToAdvertiseType, PpCollectScoreReviewType, PpAppSupportContractorType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetITToolPageTwo
// ====================================================

export interface GetITToolPageTwo_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  recruitmentMethod: RecruitmentType | null;
  selectionMethod: ParticipantSelectionType[];
}

export interface GetITToolPageTwo_modelPlan_itTools {
  __typename: "PlanITTools";
  id: UUID;
  ppToAdvertise: PpToAdvertiseType[];
  ppToAdvertiseOther: string | null;
  ppToAdvertiseNote: string | null;
  ppCollectScoreReview: PpCollectScoreReviewType[];
  ppCollectScoreReviewOther: string | null;
  ppCollectScoreReviewNote: string | null;
  ppAppSupportContractor: PpAppSupportContractorType[];
  ppAppSupportContractorOther: string | null;
  ppAppSupportContractorNote: string | null;
}

export interface GetITToolPageTwo_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  participantsAndProviders: GetITToolPageTwo_modelPlan_participantsAndProviders;
  itTools: GetITToolPageTwo_modelPlan_itTools;
}

export interface GetITToolPageTwo {
  modelPlan: GetITToolPageTwo_modelPlan;
}

export interface GetITToolPageTwoVariables {
  id: UUID;
}
