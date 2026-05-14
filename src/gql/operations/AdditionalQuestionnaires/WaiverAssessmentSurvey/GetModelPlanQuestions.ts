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
        keyCharacteristics
        keyCharacteristicsOther
        collectPlanBids
        managePartCDEnrollment
        planContractUpdated
        geographiesTargeted
        geographiesTargetedTypes
        geographiesStatesAndTerritories
        geographiesRegionTypes
        geographiesTargetedTypesOther
        geographiesTargetedAppliedTo
        geographiesTargetedAppliedToOther
        waiversRequired
        waiversRequiredTypes
      }
    }

    modelPlanCollection(filter: INCLUDE_ALL) {
      id
      modelName
    }

    existingModelCollection {
      id
      modelName
    }
  }
`);
