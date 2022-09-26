import { gql } from '@apollo/client';

export default gql`
  mutation DeletePlanFavorite($modelPlanID: UUID!) {
    deletePlanFavorite(modelPlanID: $modelPlanID) {
      modelPlanID
      userID
    }
  }
`;
