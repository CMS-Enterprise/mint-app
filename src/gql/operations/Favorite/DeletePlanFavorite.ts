import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeletePlanFavorite($modelPlanID: UUID!) {
    deletePlanFavorite(modelPlanID: $modelPlanID) {
      modelPlanID
      userID
    }
  }
`);
