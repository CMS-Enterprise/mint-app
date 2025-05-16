import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOCommonSolutions($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        # Used to cache the mto matrix - always include
        info {
          id
        }
        commonSolutions {
          name
          key
          type
          subjects
          isAdded
        }
      }
    }
  }
`);
