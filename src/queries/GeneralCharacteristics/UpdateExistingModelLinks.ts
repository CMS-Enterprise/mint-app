import { gql } from '@apollo/client';

export default gql`
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
      id
      existingModelID
      existingModel {
        id
        modelName
      }
    }
  }
`;
