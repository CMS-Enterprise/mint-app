import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateMTOReadyForReview(
    $modelPlanID: UUID!
    $readyForReview: Boolean!
  ) {
    markMTOReadyForReview(
      modelPlanID: $modelPlanID
      readyForReview: $readyForReview
    ) {
      id
    }
  }
`);
