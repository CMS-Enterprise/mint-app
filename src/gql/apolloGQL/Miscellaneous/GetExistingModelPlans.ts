import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetExistingModelPlans {
    existingModelCollection {
      id
      modelName
    }
  }
`);
