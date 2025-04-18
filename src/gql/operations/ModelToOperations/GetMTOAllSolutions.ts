import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOAllSolutions($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        # Used to cache the mto matrix - always include
        info {
          id
        }
        commonSolutions {
          key
          name
        }
        solutions {
          id
          key
          name
        }
      }
    }
  }
`);
