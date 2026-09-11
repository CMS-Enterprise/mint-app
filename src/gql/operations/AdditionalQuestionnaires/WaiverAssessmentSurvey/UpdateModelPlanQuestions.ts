import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateModelPlanQuestions(
    $modelPlanID: UUID!
    #basics
    $basicsId: UUID!
    $basicsChanges: PlanBasicsChanges!
    $withBasics: Boolean!
    #generalCharacteristics
    $generalCharacteristicsId: UUID!
    $generalCharacteristicsChanges: PlanGeneralCharacteristicsChanges!
    $withGeneralCharacteristics: Boolean!
    #resemble links
    $resemblesExistingModelIDs: [Int!]
    $resemblesCurrentModelPlanIDs: [UUID!]
    $withResemblesLinks: Boolean!
    #participation links
    $participationExistingModelIDs: [Int!]
    $participationCurrentModelPlanIDs: [UUID!]
    $withParticipationLinks: Boolean!
  ) {
    updatePlanBasics(id: $basicsId, changes: $basicsChanges)
      @include(if: $withBasics) {
      id
      modelCategory
      additionalModelCategories
      cmsCenters
      cmmiGroups
    }

    updatePlanGeneralCharacteristics(
      id: $generalCharacteristicsId
      changes: $generalCharacteristicsChanges
    ) @include(if: $withGeneralCharacteristics) {
      id
      resemblesExistingModel
      resemblesExistingModelOtherOption
      resemblesExistingModelOtherSelected
      resemblesExistingModelHow
      resemblesExistingModelWhyHow
      resemblesExistingModelOtherSpecify
      participationInModelPrecondition
      participationInModelPreconditionWhyHow
      participationInModelPreconditionOtherOption
      participationInModelPreconditionOtherSpecify
      participationInModelPreconditionOtherSelected
      geographiesTargeted
      geographiesTargetedTypes
      geographiesStatesAndTerritories
      geographiesRegionTypes
      geographiesTargetedTypesOther
      geographiesTargetedAppliedTo
      geographiesTargetedAppliedToOther
    }

    updateResemblesLinks: updateExistingModelLinks(
      modelPlanID: $modelPlanID
      fieldName: GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH
      existingModelIDs: $resemblesExistingModelIDs
      currentModelPlanIDs: $resemblesCurrentModelPlanIDs
    ) @include(if: $withResemblesLinks) {
      links {
        id
        existingModelID
        model {
          ... on ExistingModel {
            modelName
            stage
            numberOfParticipants
            keywords
          }
          ... on ModelPlan {
            modelName
            abbreviation
          }
        }
      }
    }

    updateParticipationLinks: updateExistingModelLinks(
      modelPlanID: $modelPlanID
      fieldName: GEN_CHAR_PARTICIPATION_EXISTING_MODEL_WHICH
      existingModelIDs: $participationExistingModelIDs
      currentModelPlanIDs: $participationCurrentModelPlanIDs
    ) @include(if: $withParticipationLinks) {
      links {
        id
        existingModelID
        model {
          ... on ExistingModel {
            modelName
            stage
            numberOfParticipants
            keywords
          }
          ... on ModelPlan {
            modelName
            abbreviation
          }
        }
      }
    }
  }
`);
