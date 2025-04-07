import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOAllSolutions($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
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
