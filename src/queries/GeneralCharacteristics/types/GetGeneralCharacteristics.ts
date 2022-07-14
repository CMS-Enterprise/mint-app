/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGeneralCharacteristics
// ====================================================

export interface GetGeneralCharacteristics_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  isNewModel: boolean | null;
  existingModel: string | null;
  resemblesExistingModel: boolean | null;
  resemblesExistingModelWhich: string[];
  resemblesExistingModelHow: string | null;
  resemblesExistingModelNote: string | null;
  hasComponentsOrTracks: boolean | null;
  hasComponentsOrTracksDiffer: string | null;
  hasComponentsOrTracksNote: string | null;
}

export interface GetGeneralCharacteristics_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  generalCharacteristics: GetGeneralCharacteristics_modelPlan_generalCharacteristics;
}

export interface GetGeneralCharacteristics {
  modelPlan: GetGeneralCharacteristics_modelPlan;
}

export interface GetGeneralCharacteristicsVariables {
  id: UUID;
}
