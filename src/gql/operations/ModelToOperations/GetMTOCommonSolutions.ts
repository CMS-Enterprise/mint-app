import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOCommonSolutions($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        commonSolutions {
          name
          key
          type
          isAdded
        }
      }
    }
  }
`);
