import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOCategories($id: UUID!) {
    modelPlan(id: $id) {
      mtoMatrix {
        categories {
          id
          name
        }
      }
    }
  }
`);
