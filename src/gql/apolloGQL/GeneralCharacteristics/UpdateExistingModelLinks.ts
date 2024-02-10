import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateExistingModelLinks(
    $modelPlanID: UUID!
    $fieldName: ExisitingModelLinkFieldType!
    $existingModelIDs: [Int!]
    $currentModelPlanIDs: [UUID!]
  ) {
    updateExistingModelLinks(
      modelPlanID: $modelPlanID
      fieldName: $fieldName
      existingModelIDs: $existingModelIDs
      currentModelPlanIDs: $currentModelPlanIDs
    ) {
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
