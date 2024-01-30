/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { YesNoOtherType, ExisitingModelLinkFieldType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetGeneralCharacteristics
// ====================================================

export interface GetGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links_model_ExistingModel {
  __typename: "ExistingModel";
  modelName: string;
  stage: string;
  numberOfParticipants: string | null;
  keywords: string | null;
}

export interface GetGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links_model_ModelPlan {
  __typename: "ModelPlan";
  modelName: string;
  abbreviation: string | null;
}

export type GetGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links_model = GetGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links_model_ExistingModel | GetGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links_model_ModelPlan;

export interface GetGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links {
  __typename: "ExistingModelLink";
  id: UUID | null;
  existingModelID: number | null;
  currentModelPlanID: UUID | null;
  fieldName: ExisitingModelLinkFieldType;
  model: GetGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links_model;
}

export interface GetGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich {
  __typename: "ExistingModelLinks";
  links: GetGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich_links[];
}

export interface GetGeneralCharacteristics_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  isNewModel: boolean | null;
  currentModelPlanID: UUID | null;
  existingModelID: number | null;
  resemblesExistingModel: YesNoOtherType | null;
  resemblesExistingModelHow: string | null;
  resemblesExistingModelNote: string | null;
  resemblesExistingModelWhich: GetGeneralCharacteristics_modelPlan_generalCharacteristics_resemblesExistingModelWhich | null;
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
