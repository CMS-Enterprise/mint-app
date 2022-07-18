import { gql } from '@apollo/client';

export default gql`
  query GetExistingModelPlans {
    existingModelCollection {
      id
      modelName
    }
  }
`;
