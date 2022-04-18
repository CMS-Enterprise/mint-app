import { gql } from '@apollo/client';

export default gql`
  query GetDraftModelPlans {
    modelPlanCollection {
      id
      modelName
      modelCategory
    }
  }
`;
