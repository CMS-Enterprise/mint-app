import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOCategories($id: UUID!) {
    modelPlan(id: $id) {
      mtoMatrix {
        # Used to cache the mto matrix - always include
        info {
          id
        }
        categories {
          id
          name
          subCategories {
            id
            name
          }
        }
      }
    }
  }
`);
