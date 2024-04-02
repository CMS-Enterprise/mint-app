import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation AddPlanFavorite($modelPlanID: UUID!) {
    addPlanFavorite(modelPlanID: $modelPlanID) {
      modelPlanID
      userID
    }
  }
`);
