/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanBasicsChanges, PlanGeneralCharacteristicsChanges, PlanParticipantsAndProvidersChanges, PlanBeneficiariesChanges, PlanOpsEvalAndLearningChanges, PlanPaymentsChanges, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdatePrepareForClearance
// ====================================================

export interface UpdatePrepareForClearance_updatePlanBasics {
  __typename: "PlanBasics";
  readyForClearanceBy: UUID | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface UpdatePrepareForClearance_updatePlanGeneralCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface UpdatePrepareForClearance_updatePlanParticipantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface UpdatePrepareForClearance_updatePlanBeneficiaries {
  __typename: "PlanBeneficiaries";
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface UpdatePrepareForClearance_updatePlanOpsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface UpdatePrepareForClearance_updatePlanPayments {
  __typename: "PlanPayments";
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface UpdatePrepareForClearance {
  updatePlanBasics: UpdatePrepareForClearance_updatePlanBasics;
  updatePlanGeneralCharacteristics: UpdatePrepareForClearance_updatePlanGeneralCharacteristics;
  updatePlanParticipantsAndProviders: UpdatePrepareForClearance_updatePlanParticipantsAndProviders;
  updatePlanBeneficiaries: UpdatePrepareForClearance_updatePlanBeneficiaries;
  updatePlanOpsEvalAndLearning: UpdatePrepareForClearance_updatePlanOpsEvalAndLearning;
  updatePlanPayments: UpdatePrepareForClearance_updatePlanPayments;
}

export interface UpdatePrepareForClearanceVariables {
  basicsID: UUID;
  basicsChanges: PlanBasicsChanges;
  characteristicsID: UUID;
  characteristicsChanges: PlanGeneralCharacteristicsChanges;
  participantsAndProvidersID: UUID;
  participantsAndProvidersChanges: PlanParticipantsAndProvidersChanges;
  beneficiariesID: UUID;
  benficiariesChanges: PlanBeneficiariesChanges;
  opsEvalAndLearningID: UUID;
  opsEvalAndLearningChanges: PlanOpsEvalAndLearningChanges;
  paymentsID: UUID;
  paymentsChanges: PlanPaymentsChanges;
}
