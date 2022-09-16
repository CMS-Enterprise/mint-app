import { gql } from '@apollo/client';

export default gql`
  mutation AddPlanFavorite($modelPlanID: UUID!) {
    addPlanFavorite(modelPlanID: $modelPlanID) {
      modelPlanID
      userID
    }
  }
`;
