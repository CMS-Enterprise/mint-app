import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateExistingModelLinks(
    $modelPlanID: UUID!
    $existingModelIDs: [Int!]
    $currentModelPlanIDs: [UUID!]
  ) {
    updateExistingModelLinks(
      modelPlanID: $modelPlanID
      existingModelIDs: $existingModelIDs
      currentModelPlanIDs: $currentModelPlanIDs
    ) {
      links {
        id
        existingModelID
        existingModel {
          id
          modelName
        }
      }
    }
  }
`);
