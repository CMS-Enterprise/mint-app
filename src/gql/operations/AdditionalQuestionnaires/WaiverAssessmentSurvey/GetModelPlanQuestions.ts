import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelPlanQuestions($id: UUID!) {
    modelPlan(id: $id) {
      id
      basics {
        id
        modelCategory
        additionalModelCategories
        cmsCenters
        cmmiGroups
      }
      generalCharacteristics {
        id
        isNewModel
        existingModel
        currentModelPlanID
        existingModelID
        resemblesExistingModel
        resemblesExistingModelWhyHow
        resemblesExistingModelHow
        resemblesExistingModelNote
        resemblesExistingModelWhich {
          links {
            id
            existingModelID
            currentModelPlanID
          }
        }
        resemblesExistingModelOtherSpecify
        resemblesExistingModelOtherSelected
        resemblesExistingModelOtherOption
        participationInModelPrecondition
        participationInModelPreconditionWhich {
          links {
            id
            existingModelID
            currentModelPlanID
          }
        }
        participationInModelPreconditionOtherSpecify
        participationInModelPreconditionOtherSelected
        participationInModelPreconditionOtherOption
        participationInModelPreconditionWhyHow
        participationInModelPreconditionNote
        keyCharacteristics
        keyCharacteristicsOther
        keyCharacteristicsNote
        geographiesTargeted
        geographiesTargetedTypes
        geographiesStatesAndTerritories
        geographiesRegionTypes
        geographiesTargetedTypesOther
        geographiesTargetedAppliedTo
        geographiesTargetedAppliedToOther
        geographiesTargetedNote
        waiversRequired
        waiversRequiredTypes
        waiversRequiredNote
      }
    }
  }
`);
